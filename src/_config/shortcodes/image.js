import Image from '@11ty/eleventy-img';
import path from 'node:path';

const toPosix = value => value.replace(/\\/g, '/');

const ensureLeadingDot = value => {
  const normalized = toPosix(value);
  return normalized.startsWith('./') ? normalized : `./${normalized.replace(/^\/+/, '')}`;
};

const resolveImagePath = (src, context) => {
  if (!src) {
    throw new Error('An image source is required for the image shortcode.');
  }

  if (/^https?:\/\//i.test(src)) {
    return src;
  }

  if (src.startsWith('./src')) {
    return ensureLeadingDot(src);
  }

  if (src.startsWith('/')) {
    const trimmed = src.replace(/^\/+/, '');
    return ensureLeadingDot(path.posix.join('src', trimmed));
  }

  if (src.startsWith('./')) {
    const trimmed = src.replace(/^\.\//, '');
    const inputPath = context?.page?.inputPath ? toPosix(context.page.inputPath) : null;
    if (inputPath) {
      const inputDir = path.posix.dirname(inputPath);
      return ensureLeadingDot(path.posix.join(inputDir, trimmed));
    }
    return ensureLeadingDot(path.posix.join('src', trimmed));
  }

  return ensureLeadingDot(path.posix.join('src', src));
};

const stringifyAttributes = attributeMap => {
  return Object.entries(attributeMap)
    .map(([attribute, value]) => {
      if (typeof value === 'undefined') return '';
      return `${attribute}="${value}"`;
    })
    .join(' ');
};

export async function imageShortcode (
  src,
  alt = '',
  caption = '',
  loading = 'lazy',
  containerClass,
  imageClass,
  widths = [650, 960, 1400],
  sizes = 'auto',
  formats = ['avif', 'webp', 'jpeg']

) {
  const resolvedSrc = resolveImagePath(src, this);

  const metadata = await Image(resolvedSrc, {
    widths: [...widths],
    formats: [...formats],
    urlPath: '/assets/images/',
    outputDir: './dist/assets/images/',
    filenameFormat: (id, src, width, format, options) => {
      const extension = path.extname(src);
      const name = path.basename(src, extension);
      return `${name}-${width}w.${format}`;
    }
  });

  const lowsrc = metadata.jpeg[metadata.jpeg.length - 1];

  const imageSources = Object.values(metadata)
    .map(imageFormat => {
      return `  <source type="${imageFormat[0].sourceType}" srcset="${imageFormat
        .map(entry => entry.srcset)
        .join(', ')}" sizes="${sizes}">`;
    })
    .join('\n');

  const imageAttributes = stringifyAttributes({
    'src': lowsrc.url,
    'width': lowsrc.width,
    'height': lowsrc.height,
    alt,
    loading,
    'decoding': loading === 'eager' ? 'sync' : 'async',
    ...(imageClass && {class: imageClass}),
    'eleventy:ignore': ''
  });

  const pictureElement = `<picture> ${imageSources}<img ${imageAttributes}></picture>`;

  return caption
    ? `<figure slot="image"${containerClass ? ` class="${containerClass}"` : ''}>${pictureElement}<figcaption>${caption}</figcaption></figure>`
    : `<picture slot="image"${containerClass ? ` class="${containerClass}"` : ''}>${imageSources}<img ${imageAttributes}></picture>`;
};
