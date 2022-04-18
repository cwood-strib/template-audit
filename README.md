
# Template Audit

Given a directory of twig templates, the script will output templates that are included more than once in the include/extend chain starting from some template.


```sh
node index.js my-templates/
```


## TODO
- [ ] Add more support for multiple folder locations for shared templates
- [ ] Add configurable output
- [ ] Cleanup async / fs for performance
