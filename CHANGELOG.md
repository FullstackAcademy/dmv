## 2.0.0
- Package no longer requires `angular` in the bundle, but requires it to be passed into the angular plugin
- Package will warn when using falsy nouns and unregistered verbs

## 2.0.1
- Actually passing in `angular` to the angular plugin

## 2.0.2
- Exporting angular plugin

## 2.0.3
- `class Role extends require(something)` doesn't agree with webpack require, fixing

## 2.0.4
- files requiring `mongoose` will now be functions that take in `mongoose`

## 2.0.5
- removing `mongoose` and `express` dependencies

## 2.0.6
- fixing mongoose plugin

## 2.0.7
- using array syntax for angular plugin to avoid breaking during minification
