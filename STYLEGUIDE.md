Coding conventions
------------------

Use " instead of '

Code is indented with 2 spaces.

Version control conventions
---------------------------

All new tasks/features are divided into their own branches which are, once finished, pull requested to the master and then merged into the master after one other team member has reviewed the code.

Please do not use "git push", but the proper version "git push origin <currentbranch>:<remotebranch>". Eg. if you are working on featurebranch and want to push to anotherbranch you would write "git push origin featurebranch:anotherbranch".

###Concerning Commit:###

  Use "commit" instead of "commit -m" when the commit needs more explaining, this gives you a text document to fill. 

  All commit messages should be written in imperative eg. instead of "Added view x" write "Add view x". This is because it looks a lot nicer when rebasing the history =). And because smart people do so at Google. There are some common keywords such as Create/Add, Fix, Enhance, Update, Rework, or another descriptive prompt imperative of the authors choice.

  Dont end your commit with "."
  
  Wrap the text for commits at 72 characters.



This guide is liable to changes as new issues with the standardized outlook of the project come up.
