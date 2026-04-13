---
layout: page
title: "Memberships"
permalink: /memberships/
description: "<b>Affiliations with leading global engineering and research societies.</b>"
page_eyebrow: Professional Recognition
nav: true
nav_order: 2
---

<section class="featured-section page-intro-panel">
  <div class="section-heading">
    <p class="section-kicker">Recognition profile</p>
    <h2>Professional memberships and fellowships reflecting engineering credibility, research engagement, and global community contribution</h2>
  </div>
  <div class="executive-signal-grid">
    <article>
      <h3>Engineering societies</h3>
      <p>Affiliations with leading organizations in software engineering, systems architecture, and applied research.</p>
    </article>
    <article>
      <h3>Research communities</h3>
      <p>Memberships that connect technical leadership with scholarship, peer review, and long-term discipline building.</p>
    </article>
    <article>
      <h3>Professional standing</h3>
      <p>Recognition that signals trust, contribution, and sustained impact across industry, academia, and the broader engineering ecosystem.</p>
    </article>
  </div>
</section>

<div class="projects membership-grid-shell">
  <h2 class="category">Memberships</h2>
  {%- assign sorted_memberships = site.memberships | sort: "importance" -%}
  <div class="repositories repo-grid repo-grid--memberships">
    {%- for membership in sorted_memberships -%}
      {% include membership_card.html %}
    {%- endfor %}
  </div>
</div>
