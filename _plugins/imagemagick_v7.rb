# Keep jekyll-imagemagick compatible with ImageMagick 7, where the legacy
# `convert` executable exits with a deprecation error on some installations.
require "open3"
require "shellwords"

module JekyllImagemagick
  class ImageGenerator
    alias_method :get_files_to_transform_without_signature_check, :get_files_to_transform

    def get_files_to_transform(site, directories, input_formats)
      get_files_to_transform_without_signature_check(site, directories, input_formats).reject do |path|
        File.binread(path, 4) == "%PDF"
      end
    end
  end

  class ImageConvert
    def self.executable?(name)
      ENV.fetch("PATH", "").split(File::PATH_SEPARATOR).any? do |directory|
        File.executable?(File.join(directory, name))
      end
    end

    def self.run(input_file, output_file, flags, long_edge, resize_flags)
      Jekyll.logger.info(LOG_PREFIX, "Generating image \"#{output_file}\"")
      executable = executable?("magick") ? "magick" : "convert"
      arguments = [executable, input_file]
      arguments.concat(Shellwords.split(flags.to_s))
      if long_edge != 0
        arguments.concat(["-resize", "#{long_edge}>"])
        arguments.concat(Shellwords.split(resize_flags.to_s))
      end
      arguments << output_file

      _output, error, status = Open3.capture3(*arguments)
      return if status.success?

      Jekyll.logger.error(LOG_PREFIX, "Command returned #{status.exitstatus} with error #{error.lines.first}")
    end
  end
end
