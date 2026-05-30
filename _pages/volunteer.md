---
layout: page
permalink: /volunteering/
title: Volunteering
description: <strong>  Empowering Innovation Worldwide Through Mentoring, Judging, and Speaking. </strong>
page_eyebrow: Community Leadership
nav: true
nav_order: 2
---
<section class="featured-section volunteering-intro">
  <div class="section-heading">
    <p class="section-kicker">Mentoring, judging, and speaking</p>
    <h2>Contributing to the global technology community beyond day-to-day engineering leadership</h2>
  </div>
  <p>
    Over the years, I’ve had the privilege of contributing to the global tech ecosystem through mentorship, judging, public speaking, and technical program leadership.
    As a mentor on platforms like <strong>ADPList</strong>, I offer one-on-one guidance to professionals and students navigating career transitions and engineering challenges.
    I actively serve as a judge for global competitions and awards, and as a <strong>Technical Program Committee (TPC)</strong> reviewer for prestigious conferences under
    <strong>IEEE</strong>, <strong>Springer</strong>, and other international research bodies.
  </p>
</section>

<section class="featured-section page-intro-panel">
  <div class="section-heading">
    <p class="section-kicker">Community footprint</p>
    <h2>Extending technical leadership through mentorship, judging, peer review, and ecosystem stewardship</h2>
  </div>
  <div class="executive-signal-grid">
    <article>
      <h3>Mentorship</h3>
      <p>Helping engineers and aspiring leaders grow in systems thinking, confidence, and practical career judgment.</p>
    </article>
    <article>
      <h3>Judging and review</h3>
      <p>Evaluating innovation through a lens of technical rigor, clarity of execution, scalability, and real-world impact.</p>
    </article>
    <article>
      <h3>Global contribution</h3>
      <p>Supporting a wider community of builders, researchers, and students through service, feedback, and thought leadership.</p>
    </article>
  </div>
</section>

<section class="featured-section volunteering-showcase">
  <div class="section-heading">
    <p class="section-kicker">Mentorship</p>
    <h2>ADPList sessions and mentee feedback</h2>
  </div>
  <p class="volunteering-copy">
    Mentorship isn’t just guidance. It is about helping people grow in confidence, systems thinking, and long-term career judgment.
    Through ADPList, I focus on unlocking clarity for engineers and leaders navigating growth, transitions, and technical challenges.
  </p>

  <div class="volunteering-embed">
    <iframe
      src="https://adplist.org/widgets/single-session?src=karan-kumar-ratra&amp;session=42837-mentorship-session"
      width="100%"
      height="500"
      frameborder="0"
      scrolling="no"
      loading="lazy"
    ></iframe>
  </div>

  <div class="volunteering-subheading">
    <h3>What Mentees Are Saying</h3>
  </div>

  <div class="volunteering-embed">
    <iframe
      src="https://adplist.org/widgets/reviews?src=karan-kumar-ratra"
      title="All Reviews"
      width="100%"
      height="500"
      loading="lazy"
    ></iframe>
  </div>
</section>

<section class="featured-section volunteering-list">
  <div class="section-heading">
    <p class="section-kicker">Global contribution</p>
    <h2>Selected volunteering and community leadership work</h2>
  </div>

<div class="repositories repo-grid repo-grid--volunteering">

  {% for item in site.data.volunteering %}
  <article class="card repo-card vol-card">
    <div class="repo-card-top">
      <div class="vol-logo membership-card-media">
        <img src="{{ item.logo | relative_url }}" alt="{{ item.organization }}">
      </div>
      <div class="repo-card-meta vol-details">
        <p class="impact-label">Community Leadership</p>
        <h3>{{ item.title }}</h3>
        <p class="vol-org"><strong>{{ item.organization }}</strong> ・ {{ item.year }}</p>
      </div>
    </div>

    <div class="repo-card-body">
      <div class="repo-card-text vol-desc">{{ item.description }}</div>
    </div>

    <div class="repo-card-actions">
      <a href="#" class="repo-card-link more-details-link" data-modal="modal-{{ forloop.index }}">More details</a>
      {% if item.download_link %}
        <a href="{{ item.download_link | relative_url }}" target="_blank" rel="noopener" class="repo-card-link">Certificate</a>
      {% endif %}
    </div>
  </article>

  <!-- Modal -->
  <!-- Modal -->
<div class="modal" id="modal-{{ forloop.index }}" aria-hidden="true">
  <div class="modal-content">
    <button type="button" class="close-button" data-modal="modal-{{ forloop.index }}" aria-label="Close details">&times;</button>
    
    <div class="modal-header">
      {% if item.modal_image %}
              <img src="{{ item.modal_image | relative_url }}" alt="{{ item.organization }} Image" class="modal-logo">
        {% elsif item.logo %}
            <img src="{{ item.logo | relative_url }}" alt="{{ item.organization }} Logo" class="modal-logo">
        {% endif %}

      <div class="modal-text">
        <h2>{{ item.title }} – {{ item.organization }}</h2>
        <p><strong>Year:</strong> {{ item.year }}</p>
      </div>
    </div>

    <p>{{ item.details }}</p>

    {% if item.download_link %}
      <p><a href="{{ item.download_link | relative_url }}" target="_blank" class="vol-link">Download Certificate</a></p>
    {% endif %}

    {% if item.certificate %}
      <img src="{{ item.certificate | relative_url }}" alt="Certificate" class="modal-cert-img">
    {% endif %}

    {% if item.gallery %}
     <div class="modal-gallery">
            {% for image in item.gallery %}
                <a href="{{ image | relative_url }}" data-lightbox="gallery-{{ forloop.parentloop.index }}" data-title="{{ item.title }}">
                <img src="{{ image | relative_url }}" class="modal-gallery-img" alt="Gallery image {{ forloop.index }}">
                </a>
            {% endfor %}
        </div>

    {% endif %}
  </div>
</div>

  {% endfor %}
</div>
</section>
