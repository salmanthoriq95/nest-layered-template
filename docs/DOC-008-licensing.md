# DOC-008 — Licensing and Community Scope

**Status:** MIT accepted; conduct wording proposed · **Updated:** 2026-10-28.
**Records:**

- [D-021 — MIT license and downstream scope](DOC-003-decisions.md#d-021--mit-license-and-downstream-scope)
- [D-022 — Community conduct and reporting](DOC-003-decisions.md#d-022--community-conduct-and-reporting)

**Decision:** Use the unchanged MIT license with copyright attributed to `salmanthoriq95`. Explain upstream responsibilities separately and provide a concise Code of Conduct draft with GitHub reporting.

**Reason:** The maintainer chose broad reuse, including commercial and closed-source forks, without license fees, warranty promises, or automatic responsibility for independently operated projects.

## Selected license

The [LICENSE](../LICENSE) contains the standard MIT terms. Its copyright holder is the GitHub username selected by the maintainer and read from the origin remote owner.

- Users may use, modify, redistribute, sublicense, and sell copies, including in proprietary projects.
- Copies or substantial portions must retain the copyright and permission notices.
- The project is available without a license fee. MIT does not require downstream copies, services, or forks to remain gratis or open source.
- MIT includes warranty and liability disclaimers. Their legal effect remains subject to applicable law; this is not blanket immunity from every possible claim.
- Third-party components retain their own licenses. A dependency's terms must be checked separately.

Source: [OSI's MIT license text](https://opensource.org/license/mit), retrieved 2026-10-28. Plain-language summaries do not replace or add conditions to LICENSE.

## Alternatives considered

| License | Relevant difference | Outcome |
| --- | --- | --- |
| MIT | Short permissive terms with notice retention and warranty/liability disclaimers. | Selected by the maintainer. |
| Apache-2.0 | Explicit patent grant and additional redistribution/notice provisions. | Not selected; the maintainer preferred MIT. |
| GPLv3 | Copyleft requirements for distributed derivatives; charging for copies remains allowed. | Not selected; commercial and closed-source forks were explicitly allowed. |

References: [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0), [GPLv3](https://opensource.org/license/gpl-3.0), retrieved 2026-10-28.

## Upstream and independent projects

The upstream maintainer does not automatically operate, audit, endorse, support, or maintain independent forks, modifications, or deployments. Their operators make their own operational and support decisions.

This scope statement does not alter the license or guarantee exemption from duties imposed by applicable law. No extra restriction on downstream use is added.

## Community rules and reporting

The [DOC-009 — Code of Conduct](../CODE_OF_CONDUCT.md) is an original project-specific draft for upstream interactions. Its behavior and moderation wording remains proposed; the maintainer approved using GitHub reporting without a published project email.

GitHub Support reports and repository-admin reports are different routes. Admin reporting is available only where supported and enabled. The policy states that distinction and does not promise a private maintainer inbox.

The Code of Conduct governs participation in upstream spaces, not copyright permission to use or fork the software.

Reference material: [GitHub reporting](https://docs.github.com/en/communities/maintaining-your-safety-on-github/reporting-abuse-or-spam), [GitHub conduct guidance](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/adding-a-code-of-conduct-to-your-project), and [Contributor Covenant 2.1](https://www.contributor-covenant.org/version/2/1/code_of_conduct/), retrieved 2026-10-28. The draft does not reproduce or claim to be the Contributor Covenant.
