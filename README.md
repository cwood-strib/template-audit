
# Template Audit

Given a directory of twig templates, the script will output templates that are included more than once in the include/extend chain starting from some template.

## Run it
```sh
node index.js my-templates/
```

## Output

```
From /templates/section-front/section-body.twig
{
  /templates/common/article-related.twig: 2,
  /templates/common/article-image.twig: 2,
  /templates/common/section-front-image.twig: 7
}
```

_Explanation_: Starting at `section-body.twig` there are two paths through the templates that include `article-related.twig`. 

## Caveats

This won't work for:
1) Templates in shared directories outside the directory being processed
2) Include paths that are dynamically generated at runtime (e.g. include where the path is a variable)

## TODO
- [ ] Add more support for multiple folder locations for shared templates
- [ ] Add configurable output
- [ ] Cleanup async / fs for performance
