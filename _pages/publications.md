---
layout: page
permalink: /publications/
title: Publications
description: Publications by categories in reversed chronological order.
page_eyebrow: Research and Writing
years: [2026, 2025, 2024]
nav: true
nav_order: 1
---
<!-- _pages/publications.md -->
<div class="publications">

<section class="featured-section page-intro-panel">
  <div class="section-heading">
    <p class="section-kicker">Research portfolio</p>
    <h2>Writing and publication themes that connect academic inquiry with large-scale engineering practice</h2>
  </div>
  <div class="executive-signal-grid">
    <article>
      <h3>Distributed systems</h3>
      <p>Applied and research-oriented work on resilient architectures, event-driven platforms, and scalable software systems.</p>
    </article>
    <article>
      <h3>Cloud-native engineering</h3>
      <p>Publications exploring cloud transformation, API ecosystems, observability, and modern operating models for enterprise platforms.</p>
    </article>
    <article>
      <h3>AI and automation</h3>
      <p>Research interests spanning intelligent automation, platform governance, and practical AI integration in engineering environments.</p>
    </article>
  </div>
</section>

{%- for y in page.years %}
  <h2 class="year">{{y}}</h2>
  {% bibliography -f papers -q @*[year={{y}}]* %}
{% endfor %}

</div>
