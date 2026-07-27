---
layout: page
title: Impact
permalink: /impact/
description: Evidence-backed engineering impact across enterprise fulfillment, fintech compliance, telecom platforms, and technical leadership.
page_eyebrow: Evidence of impact
nav: true
nav_order: 3
---

<section class="featured-section">
  <div class="section-heading">
    <p class="section-kicker">Selected systems</p>
    <h2>Architecture decisions connected to operating scale and measurable outcomes</h2>
    <p>These case studies separate the problem, my role, the system design, and the result—so the evidence is easier to evaluate.</p>
  </div>

  <div class="impact-case-grid">
    {% for item in site.data.impact %}
    <article class="impact-case">
      <header class="impact-case__header">
        <p class="impact-label">{{ item.label }}</p>
        <h3>{{ item.title }}</h3>
      </header>
      <div class="impact-case__body">
        <div class="impact-case__fact"><strong>Challenge</strong><p>{{ item.challenge }}</p></div>
        <div class="impact-case__fact"><strong>My role</strong><p>{{ item.role }}</p></div>
        <div class="impact-case__fact"><strong>Architecture</strong><p>{{ item.architecture }}</p></div>
        <div class="impact-case__fact"><strong>Scale</strong><p>{{ item.scale }}</p></div>
      </div>
      <div class="impact-case__outcomes">
        <ul>{% for outcome in item.outcomes %}<li>{{ outcome }}</li>{% endfor %}</ul>
      </div>
      <div class="impact-case__evidence">
        {% for link in item.evidence %}<a href="{{ link.url | relative_url }}">{{ link.label }} →</a>{% endfor %}
      </div>
    </article>
    {% endfor %}
  </div>
</section>

<section class="featured-section executive-signal">
  <div class="section-heading">
    <p class="section-kicker">Independent signals</p>
    <h2>Recognition, professional standing, and community contribution</h2>
  </div>
  <div class="executive-signal-grid">
    <article><h3>Enterprise awards</h3><p>Walmart Impact Award 2024, Walmart Excellence Awards, and PayPal Golden Envelope recognition.</p></article>
    <article><h3>Professional standing</h3><p>Senior IEEE Member and recognized fellow or member across technical and research societies.</p><a href="{{ '/memberships/' | relative_url }}">View memberships →</a></article>
    <article><h3>Global contribution</h3><p>Top 1% ADPList mentor and judge or mentor for international innovation programs.</p><a href="{{ '/volunteering/' | relative_url }}">View community work →</a></article>
  </div>
</section>
