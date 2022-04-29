
# Template Audit

Given a directory of twig templates, the script will output templates that are included more than once in the include/extend chain starting from some template. You can also generate dotviz graphs given a root template.

## Commands

### Audit

Audit all templates for some templates where there is potential for multiple include paths through the graph of all templates.

```
node src/index.js audit ../news-platform/themes/mobile-theme/templates/
```

Output example:
```
From /templates/section-front/section-body.twig
{
  /templates/common/article-related.twig: 2,
  /templates/common/article-image.twig: 2,
  /templates/common/section-front-image.twig: 7
}
```

_Explanation_: Starting at `section-body.twig` there are two paths through the templates that include `article-related.twig`. 


### Graph

Generates a [graphviz](https://graphviz.org/) graph starting from a given root template. You must provide the root directory of all twig templates. Visualize the output online [here](http://viz-js.com/).

```
node src/index.js graph --root ../news-platform/themes/mobile-theme/templates/section-front/blog-stories.twig --twigRoot ../news-platform/themes/mobile-theme/templates
```

## Caveats

This won't work for:
1) Templates in shared directories outside the directory being processed
2) Include paths that are dynamically generated at runtime (e.g. include where the path is a variable)

## TODO
- [ ] Add more support for multiple folder locations for shared templates
- [ ] Cleanup async / fs for performance
