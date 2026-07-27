---
layout: page
permalink: /volunteering/
title: Volunteering
description: <strong>  Empowering Innovation Worldwide Through Mentoring, Judging, and Speaking. </strong>
page_eyebrow: Community Leadership
content_filters: true
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

  <div class="volunteering-embed adplist-preview" data-adplist-embed data-src="https://adplist.org/widgets/single-session?src=karan-kumar-ratra&amp;session=42837-mentorship-session" data-height="500" data-title="ADPList mentorship session with Karan Kumar Ratra">
    <span class="adplist-preview__icon" aria-hidden="true"><i class="fas fa-comments"></i></span>
    <div class="adplist-preview__copy">
      <p class="section-kicker">External mentorship profile</p>
      <h3>Explore a one-to-one ADPList session</h3>
      <p>The ADPList widget loads only when requested, keeping this page faster and avoiding an unnecessary third-party connection.</p>
    </div>
    <button type="button" class="adplist-preview__button" data-adplist-load>View mentorship session</button>
  </div>

  <div class="volunteering-subheading">
    <h3>What Mentees Are Saying</h3>
  </div>

  <div class="volunteering-embed adplist-preview" data-adplist-embed data-src="https://adplist.org/widgets/reviews?src=karan-kumar-ratra" data-height="500" data-title="ADPList mentee reviews for Karan Kumar Ratra">
    <span class="adplist-preview__icon" aria-hidden="true"><i class="fas fa-star"></i></span>
    <div class="adplist-preview__copy">
      <p class="section-kicker">External reviews</p>
      <h3>Read verified mentee feedback</h3>
      <p>Load the ADPList review panel when you are ready to view feedback from past mentorship conversations.</p>
    </div>
    <button type="button" class="adplist-preview__button" data-adplist-load>View mentee reviews</button>
  </div>
</section>

<section class="featured-section volunteering-list">
  <div class="section-heading">
    <p class="section-kicker">Global contribution</p>
    <h2>Selected volunteering and community leadership work</h2>
  </div>

  <div class="content-filter" data-volunteering-filter aria-label="Filter community work">
    <div class="content-filter__group" role="group" aria-label="Community contribution type">
      <button type="button" class="filter-chip is-active" data-category="all" aria-pressed="true">All contributions</button>
      <button type="button" class="filter-chip" data-category="judging" aria-pressed="false">Judging</button>
      <button type="button" class="filter-chip" data-category="mentoring" aria-pressed="false">Mentoring</button>
      <button type="button" class="filter-chip" data-category="review" aria-pressed="false">Research review</button>
      <button type="button" class="filter-chip" data-category="speaking" aria-pressed="false">Speaking</button>
    </div>
    <p class="content-filter__status" data-filter-status aria-live="polite"></p>
  </div>

<div class="repositories repo-grid repo-grid--volunteering">

  {% for item in site.data.volunteering %}
  {% assign contribution_category = "speaking" %}
  {% if item.title contains "Judge" %}
    {% assign contribution_category = "judging" %}
  {% elsif item.title contains "Mentor" or item.title contains "ADPList" %}
    {% assign contribution_category = "mentoring" %}
  {% elsif item.title contains "Reviewer" or item.title contains "TPC" or item.title contains "Committee" %}
    {% assign contribution_category = "review" %}
  {% endif %}
  <article class="card repo-card vol-card" data-volunteering-item data-category="{{ contribution_category }}">
    <div class="repo-card-top">
      <div class="vol-logo membership-card-media">
        <img src="{{ item.logo | relative_url }}" alt="{{ item.organization }}" loading="lazy" decoding="async">
      </div>
      <div class="repo-card-meta vol-details">
        <p class="impact-label">{{ contribution_category | capitalize }}</p>
        <h3>{{ item.title }}</h3>
        <p class="vol-org"><strong>{{ item.organization }}</strong> ・ {{ item.year }}</p>
      </div>
    </div>

    <div class="repo-card-body">
      <div class="repo-card-text vol-desc">{{ item.description }}</div>
    </div>

    <div class="repo-card-actions">
      <button type="button" class="repo-card-link more-details-link" data-modal="modal-{{ forloop.index }}">More details</button>
      {% if item.download_link %}
        <a href="{{ item.download_link | relative_url }}" target="_blank" rel="noopener" class="repo-card-link">Certificate</a>
      {% endif %}
    </div>
  </article>

  <!-- Modal -->
  <!-- Modal -->
<div class="modal" id="modal-{{ forloop.index }}" aria-hidden="true" role="dialog" aria-modal="true" aria-labelledby="modal-title-{{ forloop.index }}">
  <div class="modal-content">
    <button type="button" class="close-button" data-modal="modal-{{ forloop.index }}" aria-label="Close details">&times;</button>
    
    <div class="modal-header">
      {% if item.modal_image %}
              <img src="{{ item.modal_image | relative_url }}" alt="{{ item.organization }} Image" class="modal-logo" loading="lazy" decoding="async">
        {% elsif item.logo %}
            <img src="{{ item.logo | relative_url }}" alt="{{ item.organization }} Logo" class="modal-logo" loading="lazy" decoding="async">
        {% endif %}

      <div class="modal-text">
        <h2 id="modal-title-{{ forloop.index }}">{{ item.title }} – {{ item.organization }}</h2>
        <p><strong>Year:</strong> {{ item.year }}</p>
      </div>
    </div>

    <p>{{ item.details }}</p>

    {% if item.download_link %}
      <p><a href="{{ item.download_link | relative_url }}" target="_blank" rel="noopener" class="vol-link">Download Certificate</a></p>
    {% endif %}

    {% if item.certificate %}
      <img src="{{ item.certificate | relative_url }}" alt="Certificate for {{ item.title }}" class="modal-cert-img" loading="lazy" decoding="async">
    {% endif %}

    {% if item.gallery %}
     <div class="modal-gallery">
            {% for image in item.gallery %}
                <a href="{{ image | relative_url }}" data-lightbox="gallery-{{ forloop.parentloop.index }}" data-title="{{ item.title }}">
                <img src="{{ image | relative_url }}" class="modal-gallery-img" alt="{{ item.title }} gallery image {{ forloop.index }}" loading="lazy" decoding="async">
                </a>
            {% endfor %}
        </div>

    {% endif %}
  </div>
</div>

  {% endfor %}
</div>
<div class="filter-empty" data-filter-empty hidden>No community contributions match this category.</div>
</section>
