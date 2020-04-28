# How to release this project
## Versioning Policy
#### Version  X.Y.Z
> * For  bug fixes or small changes , we make a patch release by changing the __Z__ number ( __PATCH__ )
> * For  new features or minor changes, we make a minor  release by changing the __Y__ number ( __MINOR__ )
> * For  major changes, we make a major  release by changing the __X__ number ( __MAJOR__ )

* X, Y, and Z are non-negative integers and Each element MUST increase numerically. For instance: 1.9.0 -> 1.10.0 -> 1.11.0.


# What to do

* Create release issue or just [click here](https://gitlab.com/oersi/oersi-backend/-/issues/new)
 

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
* Set next version x.y+1.z in __package.json__

  *   update the package-lock.json with new version
   ``` 
     npm install
   ```
* Or just run the command below to change the version
  ```
  npm --no-git-tag-version version minor
  ```

```
git add package.json  package-lock.json
git commit -m "next Release <RELEASE-VERSION> (Ref <ISSUE-ID>)"


```
* Push
```
git push origin develop
git push origin master
git push origin <RELEASE-VERSION>
```
