---
layout: docs
title: Options
permalink: /docs/options/
---

#### Enforcing options

{% include enforcers.html %}

#### Relaxing options

{% include relaxers.html %}

#### Environments

These options pre-define global variables that are exposed by popular JavaScript
libraries and runtime environments—such as browser or Node. Essentially they are
shortcuts for explicit declarations like `/*global $:false, jQuery:false */`.

{% include environments.html %}

#### Legacy

These options are legacy from JSLint. Aside from bug fixes they will not be
improved in any way and might be removed at any point.

{% include legacy.html %}
