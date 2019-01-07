# Contributing to kepler.gl

Great to have you here. Here are a few ways you can help make kepler.gl even better!

Note that you'll need to sign [Uber's Contributor License Agreement][cla]
before we can accept any of your contributions. If necessary, a bot will remind
you to accept the CLA when you open your pull request.

* [Code of Conduct](#coc)
* [Questions and Problems](#question)
* [Issues and Bugs](#issue)
* [Feature Requests](#feature)
* [Improving Documentation](#docs)
* [Submitting Pull Request](#submit-pr)
* [Development Documentation][developers]

## <a name="coc"></a> Code of Conduct
Help us keep kepler.gl open and inclusive. Please read and follow our [Code of Conduct](./CODE_OF_CONDUCT.md).

## <a name="question"></a> Questions and Problems
We are trying to keep our Github page for issues, bugs and feature requests only. You've got much better chances of getting supports on [Stack Overflow][stack]. Many people including our engineers are ready to answer questions on Stack Overflow. Your question might already been answered there.

## <a name="issue"></a> Issues and Bugs
If you find a bug, you can help us by submitting an [Issue][git-iss] to our GitHub Repository. Please use the github [Bug Report Template][git-bug] and fill in as much as information as possible. Even better, you can submit a [Pull Request][git-pr] with a fix.

## <a name="feature"></a> Feature Requests

If you want to contribute or add new features, please use [Issue][git-iss] on github projects to start a new discussion using the [Feature Request Template][git-feature]. If this receive a Go ahead, you can submit your patch as PR to the repository.

If you would like to implement a new feature then consider what kind of change it is:

* **Take a look at our [roadmap][roadmap]** It lists out the items  we are planning to work on
* **Pick your item** Pick an item to execute
* **Claim the item** Reply in the ticket linked in the roadmap to claim the item, one of the member of the technical team will respond
* **Major Changes** that you wish to contribute to the project should be discussed first in an
  [GitHub issue][github-issues] that clearly outlines the changes and benefits of the feature.
* **Small Changes** can directly be crafted and submitted to the [GitHub Repository][github]
  as a Pull Request. See the section about [Pull Request Submission Guidelines](#submit-pr), and
  for detailed information the [core development documentation][developers].
* **Let's review your code** Create a pull request

## <a name="docs"></a> Improving Documentation

Questions about kepler.gl? you can checkout the examples and medium articles on [kepler.gl][website].

[User Guides][user-guide] and API Docs are saved in the [docs][api-docs] folder on Github. Help us improve documentation here by submitting a Pull Request.

## <a name="submit-pr"></a> Submitting Pull Request
<b>First, follow the [development documentation][developers] for detailed guidance on setuping local environment, code style, testing and commit message conventions.</b>

* Search [GitHub][git-pr] for an open or closed Pull Request
  that relates to your submission. You don't want to duplicate effort.
* Create the [development environment][developers.setup]
* Make your changes in a new git branch:

    ```shell
    git checkout -b my-fix-branch master
    ```

* Create your patch commit, **including appropriate test cases**.
* If the changes affect public APIs, change or add relevant [documentation][developers.documentation].
* Run [tests][developers.tests], and ensure that all tests pass.
* Commit your changes using a descriptive commit message that follows our
  [commit message conventions][developers.commits]. Adherence to the conventions is required, because release notes are automatically generated from these messages.

[cla]: https://cla-assistant.io/uber/kepler.gl
[github]: https://github.com/uber/kepler.gl
[git-iss]: https://github.com/uber/kepler.gl/issues
[git-pr]: https://github.com/uber/kepler.gl/pulls
[git-feature]: https://github.com/uber/kepler.gl/issues/new?template=feature_request.md
[git-bug]: https://github.com/uber/kepler.gl/issues/new?template=bug_report.md
[stack]: https://stackoverflow.com/questions/tagged/kepler.gl
[api-docs]: https://github.com/uber/kepler.gl/tree/master/docs
[website]: https://uber.github.io/kepler.gl/#/
[user-guide]: https://github.com/uber/kepler.gl/blob/master/docs/a-introduction.md
[roadmap]: https://github.com/uber/kepler.gl/wiki/Roadmap
[developers]: DEVELOPERS.md
[developers.commits]: DEVELOPERS.md#commits
[developers.documentation]: DEVELOPERS.md#documentation
[developers.rules]: DEVELOPERS.md#rules
[developers.setup]: DEVELOPERS.md#setup
[developers.tests]: DEVELOPERS.md#tests
