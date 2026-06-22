#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const target = process.argv[2];

if (!target) {
  console.error("Usage: node korean-linebreak-audit.js <html-file-or-url>");
  process.exit(2);
}

const url = /^(https?:|file:)/.test(target)
  ? target
  : `file://${path.resolve(target)}`;

if (!/^(https?:|file:)/.test(target) && !fs.existsSync(path.resolve(target))) {
  console.error(`File not found: ${target}`);
  process.exit(2);
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1
  });

  await page.goto(url, { waitUntil: "load" });
  await page.waitForTimeout(150);

  const issues = await page.evaluate(() => {
    const hangul = /[\uac00-\ud7a3]/;
    const ignoredTags = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA"]);
    const out = [];

    function isVisibleElement(el) {
      if (!el || ignoredTags.has(el.tagName)) return false;
      if (el.closest(".ko-allow-break")) return false;
      const style = getComputedStyle(el);
      if (style.display === "none" || style.visibility === "hidden") return false;
      const rect = el.getBoundingClientRect();
      return rect.width > 1 && rect.height > 1;
    }

    function rectForChar(node, index) {
      const range = document.createRange();
      range.setStart(node, index);
      range.setEnd(node, index + 1);
      const rect = Array.from(range.getClientRects()).find((r) => r.width > 0 && r.height > 0);
      range.detach();
      return rect || null;
    }

    const textBlockSelector = [
      "h1", "h2", "h3", "h4", "h5", "h6", "p", "li", "dt", "dd",
      ".headline", ".subcopy", ".title", ".subtitle", ".body-text",
      ".ref-card p", ".compare-item", ".decision-card h3", ".decision-card p",
      ".field div", ".text-box p", ".summary-strip span", ".check b", ".check span",
      ".risk-card h3", ".risk-card p", ".alert-box span", ".audit-row span",
      ".priority h3", ".priority li", ".step span", ".preview h3", ".preview-row span",
      ".handoff p", ".kpi .label", ".nav", ".tag", ".badge", ".cell"
    ].join(",");

    function labelFor(el) {
      const named = el.closest(`[data-slide], ${textBlockSelector}, .card, .panel`);
      if (!named) return el.tagName.toLowerCase();
      const classes = Array.from(named.classList || []).slice(0, 3).join(".");
      const slide = named.closest("[data-slide]")?.getAttribute("data-slide");
      return `${slide ? `slide ${slide} ` : ""}${named.tagName.toLowerCase()}${classes ? `.${classes}` : ""}`;
    }

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue || !hangul.test(node.nodeValue)) return NodeFilter.FILTER_REJECT;
        return isVisibleElement(node.parentElement) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });

    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    for (const node of nodes) {
      const text = node.nodeValue;
      for (let i = 0; i < text.length - 1; i += 1) {
        if (!hangul.test(text[i]) || !hangul.test(text[i + 1])) continue;

        const left = rectForChar(node, i);
        const right = rectForChar(node, i + 1);
        if (!left || !right) continue;

        const threshold = Math.max(3, Math.min(left.height, right.height) * 0.45);
        if (Math.abs(left.top - right.top) <= threshold) continue;

        const parent = node.parentElement;
        const snippet = text
          .slice(Math.max(0, i - 10), Math.min(text.length, i + 12))
          .replace(/\s+/g, " ")
          .trim();

        out.push({
          where: labelFor(parent),
          split: `${text[i]}/${text[i + 1]}`,
          snippet
        });
      }
    }

    function renderedLinesFor(element) {
      const textWalker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          return node.nodeValue && node.nodeValue.trim()
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_REJECT;
        }
      });
      const chars = [];
      while (textWalker.nextNode()) {
        const node = textWalker.currentNode;
        for (let i = 0; i < node.nodeValue.length; i += 1) {
          const char = node.nodeValue[i];
          const rect = rectForChar(node, i);
          if (!rect) continue;
          chars.push({ char, top: rect.top });
        }
      }

      const lines = [];
      for (const item of chars) {
        let line = lines.find((candidate) => Math.abs(candidate.top - item.top) < 4);
        if (!line) {
          line = { top: item.top, text: "" };
          lines.push(line);
        }
        line.text += item.char;
      }

      return lines
        .sort((a, b) => a.top - b.top)
        .map((line) => line.text.replace(/\s+/g, " ").trim())
        .filter(Boolean);
    }

    for (const element of document.querySelectorAll(textBlockSelector)) {
      if (!isVisibleElement(element)) continue;
      if (!hangul.test(element.textContent || "")) continue;
      const rawText = (element.textContent || "").replace(/\s+/g, " ").trim();
      const allowsProse = Boolean(element.closest(".ko-prose, .ko-sentence-ok"));
      if (!allowsProse && /[\uac00-\ud7a3](다|니다)\.$/.test(rawText)) {
        out.push({
          where: labelFor(element),
          split: "sentence-ending",
          snippet: rawText.slice(-36)
        });
      }
      const lines = renderedLinesFor(element);
      if (lines.length < 2) continue;

      const last = lines[lines.length - 1];
      const previous = lines[lines.length - 2];
      const compactLast = last.replace(/[^\uac00-\ud7a3A-Za-z0-9]/g, "");
      const compactPrevious = previous.replace(/[^\uac00-\ud7a3A-Za-z0-9]/g, "");

      if (
        compactPrevious.length >= 10 &&
        compactLast.length > 0 &&
        compactLast.length <= 6 &&
        /(다|니다|요|입니다|필요|우선)$/.test(compactLast)
      ) {
        out.push({
          where: labelFor(element),
          split: "short-tail",
          snippet: last
        });
      }

      const protectedPhrases = [
        "작성 누락 방지", "작성 누락 방지와", "구매 검토 근거", "구매 검토 근거 확보",
        "승인 판단", "승인 판단 근거", "업무 콘솔", "업무 콘솔 설계",
        "정책 결정 후 반영", "고객 요구 충족", "가격경쟁 제한", "구매의견 확인",
        "판단 가능한", "증빙 체크리스트", "작성 프레임", "기술 호환성 증빙"
      ];

      for (const phrase of protectedPhrases) {
        const phraseParts = phrase.split(/\s+/).filter(Boolean);
        if (phraseParts.length < 2) continue;
        for (let i = 1; i < lines.length; i += 1) {
          const previousLine = lines[i - 1].replace(/\s+/g, " ").trim();
          const currentLine = lines[i].replace(/\s+/g, " ").trim();
          for (let cut = 1; cut < phraseParts.length; cut += 1) {
            const left = phraseParts.slice(0, cut).join(" ");
            const right = phraseParts.slice(cut).join(" ");
            if (previousLine.endsWith(left) && currentLine.startsWith(right)) {
              out.push({
                where: labelFor(element),
                split: "protected-phrase",
                snippet: `${left} / ${right}`
              });
            }
          }
        }
      }
    }

    return out.slice(0, 80);
  });

  await browser.close();

  if (issues.length) {
    console.error(`Korean line-break audit failed: ${issues.length} issue(s)`);
    console.error(JSON.stringify(issues, null, 2));
    process.exit(1);
  }

  console.log("Korean line-break audit passed");
})();
