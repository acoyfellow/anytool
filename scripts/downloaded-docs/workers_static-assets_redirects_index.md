---
title: Redirects · Cloudflare Workers docs
description: To apply custom redirects on a Worker with static assets, declare
  your redirects in a plain text file called _redirects without a file
  extension, in the static asset directory of your project. This file will not
  itself be served as a static asset, but will instead be parsed by Workers and
  its rules will be applied to static asset responses.
lastUpdated: 2025-08-22T14:24:45.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers/static-assets/redirects/
  md: https://developers.cloudflare.com/workers/static-assets/redirects/index.md
---

To apply custom redirects on a Worker with static assets, declare your redirects in a plain text file called `_redirects` without a file extension, in the static asset directory of your project. This file will not itself be served as a static asset, but will instead be parsed by Workers and its rules will be applied to static asset responses.

If you are using a framework, you will often have a directory named `public/` or `static/`, and this usually contains deploy-ready assets, such as favicons, `robots.txt` files, and site manifests. These files get copied over to a final output directory during the build, so this is the perfect place to author your `_redirects` file. If you are not using a framework, the `_redirects` file can go directly into your [static assets directory](https://developers.cloudflare.com/workers/static-assets/binding/#directory).

Warning

Redirects defined in the `_redirects` file are not applied to requests served by your Worker code, even if the request URL matches a rule defined in `_redirects`. You may wish to apply redirects manually in your Worker code, or explore other options such as [Bulk Redirects](https://developers.cloudflare.com/rules/url-forwarding/bulk-redirects/create-dashboard/).

## Structure

### Per line

Only one redirect can be defined per line and must follow this format, otherwise it will be ignored.

```txt
[source] [destination] [code?]
```

* `source` string required

  * A file path.
  * Can include [wildcards (`*`)](#splats) and [placeholders](#placeholders).
  * Because fragments are evaluated by your browser and not Cloudflare's network, any fragments in the source are not evaluated.

* `destination` string required

  * A file path or external link.
  * Can include fragments, query strings, [splats](#splats), and [placeholders](#placeholders).

* `code` number (default: 302) optional

  * Optional parameter

Lines starting with a `#` will be treated as comments.

### Per file

A `_redirects` file is limited to 2,000 static redirects and 100 dynamic redirects, for a combined total of 2,100 redirects. Each redirect declaration has a 1,000-character limit.

In your `_redirects` file:

* The order of your redirects matter. If there are multiple redirects for the same `source` path, the top-most redirect is applied.
* Static redirects should appear before dynamic redirects.
* Redirects are always followed, regardless of whether or not an asset matches the incoming request.

A complete example with multiple redirects may look like the following:

```txt
/home301 / 301
/home302 / 302
/querystrings /?query=string 301
/twitch https://twitch.tv
/trailing /trailing/ 301
/notrailing/ /nottrailing 301
/page/ /page2/#fragment 301
/blog/* https://blog.my.domain/:splat
/products/:code/:name /products?code=:code&name=:name
```

## Advanced redirects

Cloudflare currently offers limited support for advanced redirects.

| Feature | Support | Example | Notes |
| - | - | - | - |
| Redirects (301, 302, 303, 307, 308) | ✅ | `/home / 301` | 302 is used as the default status code. |
| Rewrites (other status codes) | ❌ | `/blog/* /blog/404.html 404` | |
| Splats | ✅ | `/blog/* /posts/:splat` | Refer to [Splats](#splats). |
| Placeholders | ✅ | `/blog/:year/:month/:date/:slug /news/:year/:month/:date/:slug` | Refer to [Placeholders](#placeholders). |
| Query Parameters | ❌ | `/shop id=:id /blog/:id 301` | |
| Proxying | ✅ | `/blog/* /news/:splat 200` | Refer to [Proxying](#proxying). |
| Domain-level redirects | ❌ | `workers.example.com/* workers.example.com/blog/:splat 301` | |
| Redirect by country or language | ❌ | `/ /us 302 Country=us` | |
| Redirect by cookie | ❌ | `/\* /preview/:splat 302 Cookie=preview` | |

## Redirects and header matching

Redirects execute before headers, so in the case of a request matching rules in both files, the redirect will win out.

### Splats

On matching, a splat (asterisk, `*`) will greedily match all characters. You may only include a single splat in the URL.

The matched value can be used in the redirect location with `:splat`.

### Placeholders

A placeholder can be defined with `:placeholder_name`. A colon (`:`) followed by a letter indicates the start of a placeholder and the placeholder name that follows must be composed of alphanumeric characters and underscores (`:[A-Za-z]\w*`). Every named placeholder can only be referenced once. Placeholders match all characters apart from the delimiter, which when part of the host, is a period (`.`) or a forward-slash (`/`) and may only be a forward-slash (`/`) when part of the path.

Similarly, the matched value can be used in the redirect values with `:placeholder_name`.

```txt
/movies/:title /media/:title
```

### Proxying

Proxying will only support relative URLs on your site. You cannot proxy external domains.

Only the first redirect in your will apply. For example, in the following example, a request to `/a` will render `/b`, and a request to `/b` will render `/c`, but `/a` will not render `/c`.

```plaintext
/a /b 200
/b /c 200
```

Note

Be aware that proxying pages can have an adverse effect on search engine optimization (SEO). Search engines often penalize websites that serve duplicate content. Consider adding a `Link` HTTP header which informs search engines of the canonical source of content.

For example, if you have added `/about/faq/* /about/faqs 200` to your `_redirects` file, you may want to add the following to your `_headers` file:

```txt
/about/faq/*
  Link: </about/faqs>; rel="canonical"
```

## Surpass `_redirects` limits

A [`_redirects`](https://developers.cloudflare.com/workers/platform/limits/#redirects) file has a maximum of 2,000 static redirects and 100 dynamic redirects, for a combined total of 2,100 redirects. Use [Bulk Redirects](https://developers.cloudflare.com/rules/url-forwarding/bulk-redirects/) to handle redirects that surpasses the 2,100 redirect rules limit of `_redirects`.

Note

The redirects defined in the `_redirects` file of your build folder can work together with your Bulk Redirects. In case of duplicates, Bulk Redirects will run in front of your Worker, where your other redirects live.

For example, if you have Bulk Redirects set up to direct `abc.com` to `xyz.com` but also have `_redirects` set up to direct `xyz.com` to `foo.com`, a request for `abc.com` will eventually redirect to `foo.com`.

To use Bulk Redirects, refer to the [Bulk Redirects dashboard documentation](https://developers.cloudflare.com/rules/url-forwarding/bulk-redirects/create-dashboard/) or the [Bulk Redirects API documentation](https://developers.cloudflare.com/rules/url-forwarding/bulk-redirects/create-api/).

## Related resources

* [Transform Rules](https://developers.cloudflare.com/rules/transform/)
