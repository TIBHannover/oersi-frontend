# How to release this project
## Versioning Policy
#### Version  X.Y
> * For  new features or minor changes, we make a minor  release by changing the __Y__ number ( __MINOR__ )
> * For  major changes, we make a major  release by changing the __X__ number ( __MAJOR__ )

* X, Y, are non-negative integers and each element __must__ increase numerically. For instance: 1.9.0 -> 1.10.0 -> 2.0.0.


# What to do

* Create release issue or just [click here](https://gitlab.com/oersi/oersi-backend/-/issues/new)
 
* (Optional) Adjust release version in __package.json__, __package-lock.json__, __sonar-project.properties__ (for example in case of a major update)

* Merge develop into master
```
git checkout master
git merge develop
```
* Create release tag
```
git tag -a <RELEASE-VERSION> -m "release <RELEASE-VERSION> (Ref <ISSUE-ID>)"
```

* Checkout the develop branch
```
git checkout develop
```
* Set next version x.y  in __package.json__ and __package-lock-json__
   ``` 
     "version": "x.y" 
   ``` 
* We keep the version also in Sonar cloud so change the version in __sonar-project.properties__
   
   ``` 
   update sonar.projectVersion=x.y
   ``` 

```
git add package.json  package-lock.json sonar-project.properties
git commit -m "next Release <RELEASE-VERSION> (Ref <ISSUE-ID>)"


```
* Push
```
git push origin develop
git push origin master
git push origin <RELEASE-VERSION>
```
