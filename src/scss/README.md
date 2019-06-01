# SCSS Boilerplate

Since I was tired of constantly creating the same old folders and files for the basic SCSS structure I'd like to use for my projects, I went and created this. Contains utility which was amassed from different projects and experiences and the custom plain variable setup to use across the design. Breaking out of customs is bad. 



```├─ base
├─ base
│  ├─ __base.scss
│  ├─ _colors.scss
│  ├─ _variablesB.scss
├─ util
│  ├─ __util.scss
│  ├─ _containers.scss
│  ├─ _utilityB.scss
├─ layout
│  ├─ __layout.scss
│  ├─ _layoutA.scss
│  ├─ _layoutB.scss
├─ ui
│  ├─ __ui.scss
│  ├─ _button.scss
│  ├─ _uiB.scss
├─ views
│  ├─ __views.scss
│  ├─ _landing.scss
│  ├─ _custom.scss
└─ styles.scss
```

Every SCSS-subdirectory (base, util, layout, ui, views) should contain an identically named file, preceded with two underscores (in order to keep it at the top of the directory). The sole purpose of these files is to import other files within that same directory. This keeps the main SCSS file clean and every file in context.

If required, subdirectories can contain further directories to group similar or related files, while keeping the size of single files small and context as low as possible.



#### __base.scss

```scss
/// __base.scss
/// Import file for base variables

@import "colors";
```



#### ih-styles.scss

```scss
/// ih-styles.scss

@import "base/_base";
@import "util/_util";
@import "layout/_layout";
@import "ui/_ui";
@import "views/_views";
```



### BEM-Naming Convention

In order to keep specificity low, while avoiding inheritance and the cascade spreading all over, we're using BEM for selection of classnames. This adds modularity and an artificial scope to classes. While classnames can be long, this improves render time significantly for large pages, as well as quality and maintainability of SCSS if used correctly.

**Format:** `.block__element.-modifier` (original format: `.block__element--modifier`)



#### Reducing length for JS-relevant classes

Especially modifiers are often used in JS, as they can also define the state of the component. To create a shortcut from the original  `.dropdown__item--active`, we'll shorten it to `.dropdown__item.-active`. This keeps a similar approach, but reduces the length of the class you need to toggle to `.-active`.