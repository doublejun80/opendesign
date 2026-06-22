export const supportedPatterns = new Set([
  'title',
  'cards',
  'split',
  'matrix',
  'roadmap',
  'issue-tree',
  'visual-hero',
  'bento-synthesis',
  'risk-control',
  'appendix'
]);

export const knownReferenceSources = new Set([
  'lazyweb',
  'mobbin',
  'refero',
  'open-design',
  'manual',
  'user'
]);

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function checkArray(errors, value, path, min = 1) {
  if (!Array.isArray(value) || value.length < min) {
    errors.push(`${path} must be an array with at least ${min} item(s).`);
    return false;
  }
  return true;
}

export function validateBrief(brief) {
  const errors = [];

  if (!brief || typeof brief !== 'object' || Array.isArray(brief)) {
    return ['brief must be a JSON object.'];
  }

  if (!isNonEmptyString(brief.title)) {
    errors.push('title is required.');
  }

  if (!checkArray(errors, brief.slides, 'slides')) {
    return errors;
  }

  if (brief.references !== undefined) {
    if (!Array.isArray(brief.references)) {
      errors.push('references must be an array when provided.');
    } else {
      brief.references.forEach((reference, i) => {
        if (!reference || typeof reference !== 'object') {
          errors.push(`references[${i}] must be an object.`);
          return;
        }
        if (!isNonEmptyString(reference.source)) {
          errors.push(`references[${i}].source is required.`);
        } else if (!knownReferenceSources.has(reference.source)) {
          errors.push(`references[${i}].source "${reference.source}" is not recognized.`);
        }
        if (!isNonEmptyString(reference.title)) {
          errors.push(`references[${i}].title is required.`);
        }
      });
    }
  }

  brief.slides.forEach((slide, i) => {
    const prefix = `slides[${i}]`;

    if (!slide || typeof slide !== 'object' || Array.isArray(slide)) {
      errors.push(`${prefix} must be an object.`);
      return;
    }

    if (!isNonEmptyString(slide.title)) {
      errors.push(`${prefix}.title is required.`);
    }

    const pattern = slide.pattern || 'cards';
    if (!supportedPatterns.has(pattern)) {
      errors.push(`${prefix}.pattern "${pattern}" is not supported. Supported patterns: ${[...supportedPatterns].join(', ')}.`);
      return;
    }

    if (pattern === 'cards') {
      if (!checkArray(errors, slide.cards, `${prefix}.cards`)) return;
      if (slide.cards.length > 3) {
        errors.push(`${prefix}.cards must contain 3 cards or fewer for executive density.`);
      }
      slide.cards.forEach((card, j) => {
        if (!isNonEmptyString(card?.title)) errors.push(`${prefix}.cards[${j}].title is required.`);
        if (!isNonEmptyString(card?.body)) errors.push(`${prefix}.cards[${j}].body is required.`);
      });
    }

    if (pattern === 'split') {
      checkArray(errors, slide.leftItems, `${prefix}.leftItems`);
      checkArray(errors, slide.rightItems, `${prefix}.rightItems`);
    }

    if (pattern === 'matrix') {
      if (!checkArray(errors, slide.columns, `${prefix}.columns`)) return;
      if (!checkArray(errors, slide.rows, `${prefix}.rows`)) return;
      slide.rows.forEach((row, j) => {
        if (!isNonEmptyString(row?.label)) errors.push(`${prefix}.rows[${j}].label is required.`);
        if (!Array.isArray(row?.values) || row.values.length !== slide.columns.length) {
          errors.push(`${prefix}.rows[${j}].values must match columns length.`);
        }
      });
    }

    if (pattern === 'roadmap') {
      checkArray(errors, slide.phases, `${prefix}.phases`);
    }

    if (pattern === 'issue-tree') {
      if (!isNonEmptyString(slide.root)) errors.push(`${prefix}.root is required for issue-tree.`);
      if (!checkArray(errors, slide.branches, `${prefix}.branches`)) return;
      if (slide.branches.length > 4) {
        errors.push(`${prefix}.branches must contain 4 branches or fewer.`);
      }
      slide.branches.forEach((branch, j) => {
        if (!isNonEmptyString(branch?.title)) errors.push(`${prefix}.branches[${j}].title is required.`);
        checkArray(errors, branch?.items, `${prefix}.branches[${j}].items`);
      });
    }

    if (pattern === 'visual-hero') {
      if (!checkArray(errors, slide.points, `${prefix}.points`)) return;
      if (!checkArray(errors, slide.visuals, `${prefix}.visuals`)) return;
      if (slide.visuals.length > 4) {
        errors.push(`${prefix}.visuals must contain 4 visuals or fewer.`);
      }
      slide.visuals.forEach((visual, j) => {
        if (!isNonEmptyString(visual?.title)) errors.push(`${prefix}.visuals[${j}].title is required.`);
        if (!isNonEmptyString(visual?.url)) errors.push(`${prefix}.visuals[${j}].url is required.`);
        if (!isNonEmptyString(visual?.source)) errors.push(`${prefix}.visuals[${j}].source is required.`);
      });
    }

    if (pattern === 'bento-synthesis') {
      if (!checkArray(errors, slide.tiles, `${prefix}.tiles`)) return;
      if (slide.tiles.length > 6) {
        errors.push(`${prefix}.tiles must contain 6 tiles or fewer.`);
      }
      slide.tiles.forEach((tile, j) => {
        if (!isNonEmptyString(tile?.label)) errors.push(`${prefix}.tiles[${j}].label is required.`);
        if (!isNonEmptyString(tile?.value)) errors.push(`${prefix}.tiles[${j}].value is required.`);
        if (!isNonEmptyString(tile?.body)) errors.push(`${prefix}.tiles[${j}].body is required.`);
      });
    }

    if (pattern === 'risk-control') {
      if (!checkArray(errors, slide.risks, `${prefix}.risks`)) return;
      if (slide.risks.length > 5) {
        errors.push(`${prefix}.risks must contain 5 items or fewer.`);
      }
      slide.risks.forEach((risk, j) => {
        if (!isNonEmptyString(risk?.risk)) errors.push(`${prefix}.risks[${j}].risk is required.`);
        if (!isNonEmptyString(risk?.control)) errors.push(`${prefix}.risks[${j}].control is required.`);
      });
    }

    if (pattern === 'appendix') {
      checkArray(errors, slide.notes, `${prefix}.notes`);
    }
  });

  return errors;
}

export function assertValidBrief(brief) {
  const errors = validateBrief(brief);
  if (errors.length > 0) {
    const error = new Error(errors.join('\n'));
    error.validationErrors = errors;
    throw error;
  }
}
