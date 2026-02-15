---
layout: default
permalink: /blog/
title: blog
nav: true
nav_order: 4
---

<div class="post">

  <div class="header-bar">
    <h1>Technical Blog</h1>
    <h2>Deep dives into ML systems</h2>
  </div>

  <ul class="post-list">
    {% for post in site.posts %}
    
    {% assign read_time = post.content | number_of_words | divided_by: 180 | plus: 1 %}
    {% assign year = post.date | date: "%Y" %}

    <li>
      <h3>
        <a class="post-title" href="{{ post.url | relative_url }}">{{ post.title }}</a>
      </h3>
      <p>{{ post.description }}</p>
      <p class="post-meta">
        {{ read_time }} min read &nbsp; &middot; &nbsp;
        {{ post.date | date: '%B %d, %Y' }}
      </p>
    </li>

    {% endfor %}
  </ul>

</div>
