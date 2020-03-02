# Contributing to kepler.gl

Great to have you here. Here are a few ways you can help make kepler.gl even better!

* [Developer Certification of Origin \(DCO\)](contributing.md#dco)
* [Code of Conduct](contributing.md#coc)
* [Questions and Problems](contributing.md#question)
* [Issues and Bugs](contributing.md#issue)
* [Feature Requests](contributing.md#feature)
* [Improving Documentation](contributing.md#docs)
* [Submitting Pull Request](contributing.md#submit-pr)
* [Development Documentation](developers.md)

## Developer Certification of Origin \(DCO\)

When commiting code, kepler.gl requires [Developer Certificate of Origin \(DCO\)](https://probot.github.io/apps/dco/) process to be followed.

The DCO is a lightweight way for contributors to certify that they wrote or otherwise have the right to submit the code they are contributing to the project. Here is the full text of the DCO, reformatted for readability:

```text
By making a contribution to this project, I certify that:

(a) The contribution was created in whole or in part by me and I have the right to submit it under the open source license indicated in the file; or

(b) The contribution is based upon previous work that, to the best of my knowledge, is covered under an appropriate open source license and I have the right under that license to submit that work with modifications, whether created in whole or in part by me, under the same open source license (unless I am permitted to submit under a different license), as indicated in the file; or

(c) The contribution was provided directly to me by some other person who certified (a), (b) or (c) and I have not modified it.

(d) I understand and agree that this project and the contribution are public and that a record of the contribution (including all personal information I submit with it, including my sign-off) is maintained indefinitely and may be redistributed consistent with this project or the open source license(s) involved.
```

### DCO Sign-Off Methods

Contributors sign-off that they adhere to these requirements by adding a Signed-off-by line to commit messages.

```text
Signed-off-by: Shan He <heshan0131@gmail.com>
```

Use the `-s` or `--signoff` command line to append this automatically to your commit message:

```text
$ git commit -s -m 'This is my commit message'
```

## Code of Conduct

Help us keep kepler.gl open and inclusive. Please read and follow our [Code of Conduct](code_of_conduct.md).

## Questions and Problems

We are trying to keep our Github page for issues, bugs and feature requests only. You've got much better chances of getting supports on [Stack Overflow](https://stackoverflow.com/questions/tagged/kepler.gl). Many people including our engineers are ready to answer questions on Stack Overflow. Your question might already been answered there.

## Issues and Bugs

If you find a bug, you can help us by submitting an [Issue](https://github.com/keplergl/kepler.gl/issues) to our GitHub Repository. Please use the github [Bug Report Template](https://github.com/keplergl/kepler.gl/issues/new?template=bug_report.md) and fill in as much as information as possible. Even better, you can submit a [Pull Request](https://github.com/keplergl/kepler.gl/pulls) with a fix.

## Feature Requests

If you want to contribute or add new features, please use [Issue](https://github.com/keplergl/kepler.gl/issues) on github projects to start a new discussion using the [Feature Request Template](https://github.com/keplergl/kepler.gl/issues/new?template=feature_request.md). If this receive a Go ahead, you can submit your patch as PR to the repository.

If you would like to implement a new feature then consider what kind of change it is:

* **Take a look at our** [**roadmap**](https://github.com/keplergl/kepler.gl/wiki/Roadmap) It lists out the items  we are planning to work on
* **Pick your item** Pick an item to execute
* **Claim the item** Reply in the ticket linked in the roadmap to claim the item, one of the member of the technical team will respond
* **Major Changes** that you wish to contribute to the project should be discussed first in an

  \[GitHub issue\]\[github-issues\] that clearly outlines the changes and benefits of the feature.

* **Small Changes** can directly be crafted and submitted to the [GitHub Repository](https://github.com/keplergl/kepler.gl)

  as a Pull Request. See the section about [Pull Request Submission Guidelines](contributing.md#submit-pr), and

  for detailed information the [core development documentation](developers.md).

* **Let's review your code** Create a pull request

## Improving Documentation

Questions about kepler.gl? you can checkout the examples and medium articles on [kepler.gl](https://keplergl.github.io/kepler.gl).

[User Guides](https://github.com/keplergl/kepler.gl/blob/master/docs/a-introduction.md) and API Docs are saved in the [docs](https://github.com/keplergl/kepler.gl/tree/master/docs) folder on Github. Help us improve documentation here by submitting a Pull Request.

## Submitting Pull Request

**First, follow the** [**development documentation**](developers.md) **for detailed guidance on environment setup, code style, testing and commit message conventions.**

* Search [GitHub](https://github.com/keplergl/kepler.gl/pulls) for an open or closed Pull Request

  that relates to your submission. You don't want to duplicate effort.

* Create the [development environment](developers.md#setup)
* Make your changes in a new git branch:

  ```text
    git checkout -b my-fix-branch master
  ```

* Create your patch commit, **including appropriate test cases**.
* If the changes affect public APIs, change or add relevant [documentation](developers.md#documentation).
* Run [tests](developers.md#tests), and ensure that all tests pass.
* Commit your changes using a descriptive commit message that follows our

  [commit message conventions](developers.md#commits). Adherence to the conventions is required, because release notes are automatically generated from these messages.

