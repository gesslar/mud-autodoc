# mud-autodoc

Designed to be run as a cron job or at-will, this app will read your .c files
in your mudlib and write documentaiton based on matching regex expressions
results to an autodoc directory.

Copy `config.sample.json` to `config.json` and modify the values within to your
particular mudlib.

After configuring `config.json`, perform: `node run`

__WARNING__ Running the autodoc app deletes and rewrites all documentation
specified in the `documents` path.

## config.json

### mudlib
This property describes the full file path to your mudlib, without a trailing `/`.

### documents
This property describes the path, relative to your mudlib, that houses your
autodoc-generated documentation, without a trailing `/`.

### tags
An array of objects that contain the definitions for each of the types of
documentation that you would like to find and document, in the form of

```
{
    "expression": String, 
    "directory" : String,
    "type" : String,
    "includeLineNumber": Boolean
}
```
1. __expression__ - String value representing the regex you would like to match on
for this documentation type.
2. __directory__ - the subdirectory in the autodoc directory to house this 
documentation type
3. __type__ - The type of documentation. Valid values are: `documentation`,
`function`.
4. __includeLineNumber__ - Only valid for documents of type `function`, if `true`
this will include the file and line number where the match occurred.

### filters
Describes items that will be ignored by the scanner.
1. __paths__ - An array of Strings representing the paths, local to the mudlib,
which will be ignored by the scanner.
2. __terms__ - An array of Strings representing words which, if they appear in
any file path, will be ignored by the scanners.
