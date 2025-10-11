---
title: R2 · Cloudflare AI Search docs
description: You can use Cloudflare R2 to store data for indexing. To get
  started, configure an R2 bucket containing your data.
lastUpdated: 2025-09-24T17:03:07.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/ai-search/configuration/data-source/r2/
  md: https://developers.cloudflare.com/ai-search/configuration/data-source/r2/index.md
---

You can use Cloudflare R2 to store data for indexing. To get started, [configure an R2 bucket](https://developers.cloudflare.com/r2/get-started/) containing your data.

AI Search will automatically scan and process supported files stored in that bucket. Files that are unsupported or exceed the size limit will be skipped during indexing and logged as errors.

## File limits

AI Search has different file size limits depending on the file type:

* **Plain text files:** Up to **4 MB**
* **Rich format files:** Up to **4 MB**

Files that exceed these limits will not be indexed and will show up in the error logs.

## File types

AI Search can ingest a variety of different file types to power your RAG. The following plain text files and rich format files are supported.

### Plain text file types

AI Search supports the following plain text file types:

| Format | File extensions | Mime Type |
| - | - | - |
| Text | `.txt`, `.rst` | `text/plain` |
| Log | `.log` | `text/plain` |
| Config | `.ini`, `.conf`, `.env`, `.properties`, `.gitignore`, `.editorconfig`, `.toml` | `text/plain`, `text/toml` |
| Markdown | `.markdown`, `.md`, `.mdx` | `text/markdown` |
| LaTeX | `.tex`, `.latex` | `application/x-tex`, `application/x-latex` |
| Script | `.sh`, `.bat` , `.ps1` | `application/x-sh` , `application/x-msdos-batch`, `text/x-powershell` |
| SGML | `.sgml` | `text/sgml` |
| JSON | `.json` | `application/json` |
| YAML | `.yaml`, `.yml` | `application/x-yaml` |
| CSS | `.css` | `text/css` |
| JavaScript | `.js` | `application/javascript` |
| PHP | `.php` | `application/x-httpd-php` |
| Python | `.py` | `text/x-python` |
| Ruby | `.rb` | `text/x-ruby` |
| Java | `.java` | `text/x-java-source` |
| C | `.c` | `text/x-c` |
| C++ | `.cpp`, `.cxx` | `text/x-c++` |
| C Header | `.h`, `.hpp` | `text/x-c-header` |
| Go | `.go` | `text/x-go` |
| Rust | `.rs` | `text/rust` |
| Swift | `.swift` | `text/swift` |
| Dart | `.dart` | `text/dart` |

### Rich format file types

AI Search uses [Markdown Conversion](https://developers.cloudflare.com/workers-ai/features/markdown-conversion/) to convert rich format files to markdown. The following table lists the supported formats that will be converted to Markdown:

| Format | File extensions | Mime Types |
| - | - | - |
| PDF Documents | `.pdf` | `application/pdf` |
| Images 1 | `.jpeg`, `.jpg`, `.png`, `.webp`, `.svg` | `image/jpeg`, `image/png`, `image/webp`, `image/svg+xml` |
| HTML Documents | `.html` | `text/html` |
| XML Documents | `.xml` | `application/xml` |
| Microsoft Office Documents | `.xlsx`, `.xlsm`, `.xlsb`, `.xls`, `.et`, `.docx` | `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`, `application/vnd.ms-excel.sheet.macroenabled.12`, `application/vnd.ms-excel.sheet.binary.macroenabled.12`, `application/vnd.ms-excel`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document` |
| Open Document Format | `.ods`, `.odt` | `application/vnd.oasis.opendocument.spreadsheet`, `application/vnd.oasis.opendocument.text` |
| CSV | `.csv` | `text/csv` |
| Apple Documents | `.numbers` | `application/vnd.apple.numbers` |

1 Image conversion uses two Workers AI models for object detection and summarization. See [Workers AI pricing](https://developers.cloudflare.com/workers-ai/features/markdown-conversion/#pricing) for more details.
