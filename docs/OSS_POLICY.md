# Open-Source Software (OSS) License Policy

## 1. Overview

This document outlines the policy for using open-source software within the "Applaude" platform. Our goal is to leverage the benefits of OSS while managing legal risks and ensuring compliance with license obligations.

## 2. Approved Licenses

The following licenses are **pre-approved** for use in the Applaude codebase without requiring additional review. These licenses are generally permissive and have minimal restrictions.

* MIT License
* Apache License 2.0
* BSD License (2-Clause and 3-Clause)
* ISC License

## 3. Denied Licenses

The following licenses are **strictly forbidden** for use in any part of the Applaude codebase. These are strong copyleft licenses that can have viral effects on our proprietary code.

* GNU General Public License (GPL) - all versions
* GNU Affero General Public License (AGPL) - all versions
* GNU Lesser General Public License (LGPL) - all versions
* Creative Commons ShareAlike (CC BY-SA)

## 4. Licenses Requiring Review

Some licenses may be acceptable but require a case-by-case review by the legal and engineering leadership. These include, but are not limited to:

* Mozilla Public License (MPL) 2.0
* Common Development and Distribution License (CDDL)
* Eclipse Public License (EPL)

## 5. Process for Requesting an Exception

If a developer needs to use a library with a license that is not on the approved list, they must follow this process:

1.  **Submit a Request:** Create a new issue in the project's issue tracker with the label "License Review".
2.  **Provide Justification:** The request must include:
    * The name and version of the library.
    * A link to the library's license file.
    * A clear business or technical justification for why this specific library is necessary.
    * An analysis of potential alternatives with approved licenses.
3.  **Review and Approval:** The request will be reviewed by the Principal Engineer and Legal Counsel. Approval will be granted only if the benefits clearly outweigh the risks and a compliance plan is established.

## 6. Compliance and Enforcement

* **Automated Scanning:** The CI/CD pipeline includes an automated job to scan all dependencies (`requirements.txt` and `package.json`) for license compliance.
* **Build Failure:** The CI build will **fail** if any dependency uses a license from the **Denied Licenses** list or an unapproved license from the **Licenses Requiring Review** list.
* **Regular Audits:** The engineering team will conduct periodic audits of our dependencies to ensure ongoing compliance.
