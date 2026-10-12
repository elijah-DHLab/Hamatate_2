# Knowledge data-provider contract · 1.0

## Separation of responsibilities

`knowledge-core.js` defines validation, providers and counting functions independently of the UI.
`knowledge-ui.js` receives one normalized knowledge payload and links it to the edition via identifiers.
`build_knowledge.py` is the adapter for the supplied Word-XML-derived dataset. A future backend may use XML, TEI, Excel or other sources, but it must emit this contract.

The current site still loads its legacy edition using A228401-specific scripts. This contract makes the **new knowledge layer** replaceable, not the whole legacy application magically generic.

## Configuration

Static files (the shipped mode):
```json
{
  "knowledgeProvider": {
    "mode": "static",
    "registry": {
      "A228401": "productions/A228401/data/knowledge.json"
    }
  }
}
```

API (proposed endpoint contract, not a deployed service):
```json
{
  "knowledgeProvider": {
    "mode": "api",
    "baseUrl": "https://YOUR-SERVICE.example/api/v1/",
    "endpoint": "productions/{id}/knowledge",
    "pageLimit": 100
  }
}
```

The provider requests JSON. A page returns `schemaVersion`, `productionId`, `source`, `categories`, `terms`, `notes`, and `observations`, plus optional `next`. Each page must include the referenced category/term/note definitions required by its observations. Shared definitions are merged by stable identifier. Source XML hash must agree across all pages. A `next` URL cannot change origin. Repeated pages and conflicting revisions are errors.

No access token belongs in public HTML/JS or a public GitHub repository. An authenticated source service needs a suitable authorized server/proxy. CORS, authorization, deployment, rights and cache policies must be configured in that service; they are not implemented by this static package.

## Principal fields

- `schemaVersion`: `hamatate.knowledge/1.0`.
- `productionId`: the actual A identifier, not a display title.
- `source.xmlSha256`: hash of the immutable source revision.
- `source.editionSha256`: hash of the extracted edition file.
- Category: `id`, `label`, `sourceLabel`, `kind`, `color`, `basis`, `termIds`.
- Term: `id`, `label`, `kind` (`explicit-note-subject` or `anchor-context`), `categoryIds`.
- Observation: `id`, `productionId`, `categoryId`, `termId`, `noteId`, `anchor`, `assignment`, `basis`, `source`.
- Note dictionary: original full text, visible numbering and occurrence metadata.

The term “term” is a transport bucket, not a promise that every entry is a resolved conceptual entity. `anchor-context` must remain visibly distinguishable from an explicit subject.

## Anchoring

`anchor.paragraphId` resolves against the edition's stable paragraph.
`anchor.unitId` must agree with that paragraph's T.
`anchor.offset`, and optional range `start`/`end`, are Unicode-code-point offsets in the **immutable source paragraph**, not UTF-16 DOM offsets and not positions in cleaned display text.
`anchor.range.exact` must match the exact substring. The UI checks these constraints before it displays the layer and converts code-point offsets for JavaScript rendering.
A point anchor does not license guessing a word span.

Raw Word paragraph IDs, file part and note ID are also preserved. If the source revision changes, regenerate or explicitly remap annotations; do not reuse stale positions silently.

## Lifecycle

1. Load edition.
2. Load knowledge payload through configured provider.
3. Validate payload and all local links.
4. Check production and source version against the edition.
5. Render views from shared selection state.
6. Export selected observations with source revision and selection settings.

Static/API loading failures are shown; the HTTP mode does not silently substitute an old embedded snapshot. The standalone build explicitly uses an embedded provider.

## Counting

Coverage is distinct source paragraphs containing evidence divided by eligible nonempty source paragraphs in the selected domain. Raw-count mode deduplicates evidence references. Overlap is explicitly scoped to note, paragraph or unit. Changing the screen layout never changes these definitions.

## API test status

A live remote API was not supplied. Pagination, errors, caching, duplicate detection and version conflicts are tested with provider-level mocked responses. The mock responses are not included in reader data and are not research observations.
