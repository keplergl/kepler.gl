# Cloud provider referecens

### Table of Contents

* [Provider](cloud-provider.md#provider)
  * [downloadMap](cloud-provider.md#downloadmap)
  * [getAccessToken](cloud-provider.md#getaccesstoken)
  * [getMapUrl](cloud-provider.md#getmapurl)
  * [getShareUrl](cloud-provider.md#getshareurl)
  * [getUserName](cloud-provider.md#getusername)
  * [hasPrivateStorage](cloud-provider.md#hasprivatestorage)
  * [hasSharingUrl](cloud-provider.md#hassharingurl)
  * [listMaps](cloud-provider.md#listmaps)
  * [login](cloud-provider.md#login)
  * [logout](cloud-provider.md#logout)
  * [uploadMap](cloud-provider.md#uploadmap)
* [MapResponse](cloud-provider.md#mapresponse)
* [Viz](cloud-provider.md#viz)

## Provider

The default provider class

**Parameters**

* `props` [**object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) 
  * `props.name` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) 
  * `props.displayName` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) 
  * `props.icon` **ReactElement** React element
  * `props.thumbnail` [**object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) thumbnail size object
    * `props.thumbnail.width` [**number**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number) thumbnail width in pixels
    * `props.thumbnail.height` [**number**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number) thumbnail height in pixels

**Examples**

```javascript
const myProvider = new Provider({
 name: 'foo',
 displayName: 'Foo Storage'
 icon: Icon,
 thumbnail: {width: 300, height: 200}
})
```

### downloadMap

This method will be called when user select a map to load from the storage map viewer

**Parameters**

* `loadParams` **any** the loadParams property of each visualization object

**Examples**

```javascript
async downloadMap(loadParams) {
 const mockResponse = {
   map: {
     datasets: [],
     config: {},
     info: {
       app: 'kepler.gl',
       created_at: ''
       title: 'test map',
       description: 'Hello this is my test dropbox map'
     }
   },
   // pass csv here if your provider currently only support save / load file as csv
   format: 'keplergl'
 };

 return downloadMap;
}
```

Returns [**MapResponse**](cloud-provider.md#mapresponse) the map object containing dataset config info and format option

### getAccessToken

This method is called to determine whether user already logged in to this provider

Returns [**boolean**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean) true if a user already logged in

### getMapUrl

This method is called by kepler.gl demo app to pushes a new location to history, becoming the current location.

**Parameters**

* `fullURL` [**boolean**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean) Whether to return the full url with domain, or just the location \(optional, default `true`\)

Returns [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) mapUrl

### getShareUrl

This method is called after user share a map, to display the share url.

**Parameters**

* `fullUrl` [**boolean**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean) Whether to return the full url with domain, or just the location \(optional, default `false`\)

Returns [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) shareUrl

### getUserName

This method is called to get the user name of the current user. It will be displayed in the cloud provider tile.

Returns [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) true if a user already logged in

### hasPrivateStorage

Whether this provider support upload map to a private storage. If truthy, user will be displayed with the storage save icon on the top right of the side bar.

Returns [**boolean**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)

### hasSharingUrl

Whether this provider support share map via a public url, if truthy, user will be displayed with a share map via url under the export map option on the top right of the side bar

Returns [**boolean**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)

### listMaps

This method is called to get a list of maps saved by the current logged in user.

**Examples**

```javascript
async listMaps() {
   return [
     {
       id: 'a',
       title: 'My map',
       description: 'My first kepler map',
       imageUrl: 'http://',
       lastModification: 1582677787000,
       privateMap: false,
       loadParams: {}
     }
   ];
 }
```

Returns [**Array**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)**&lt;**[**Viz**](cloud-provider.md#viz)**&gt;** an array of Viz objects

### login

This method will be called when user click the login button in the cloud provider tile. Upon login success, `onCloudLoginSuccess` has to be called to notify kepler.gl UI

**Parameters**

* `onCloudLoginSuccess` [**function**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function) callbacks to be called after login success

### logout

This method will be called when user click the logout button under the cloud provider tile. Upon login success, `onCloudLoginSuccess` has to be called to notify kepler.gl UI

**Parameters**

* `onCloudLogoutSuccess` [**function**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function) callbacks to be called after logout success

### uploadMap

This method will be called to upload map for saving and sharing. Kepler.gl will package map data, config, title, description and thumbnail for upload to storage. With the option to overwrite already saved map, and upload as private or public map.

**Parameters**

* `param` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) 
  * `param.mapData` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) the map object
    * `param.mapData.map` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) {datasets. config, info: {title, description}}
    * `param.mapData.thumbnail` [**Blob**](https://developer.mozilla.org/docs/Web/API/Blob) A thumbnail of current map. thumbnail size can be defined by provider by this.thumbnail
  * `param.options` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)  \(optional, default `{}`\)
    * `param.options.overwrite` [**boolean**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean) whether user choose to overwrite already saved map under the same name
    * `param.options.isPublic` [**boolean**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean) whether user wish to share the map with others. if isPublic is truthy, kepler will call this.getShareUrl\(\) to display an URL they can share with others

## MapResponse

The returned object of `downloadMap`. The response object should contain: datasets: \[\], config: {}, and info: {} each dataset object should be {info: {id, label}, data: {...}} to inform how kepler should process your data object, pass in `format`

Type: [Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)

### Properties

* `map` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) 
  * `map.datasets` [**Array**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)**&lt;**[**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)**&gt;** 
  * `map.config` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) 
  * `map.info` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) 
* `format` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) one of 'csv': csv file string, 'geojson': geojson object, 'row': row object, 'keplergl': datasets array saved using KeplerGlSchema.save

## Viz

Type: [Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)

### Properties

* `id` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) An unique id
* `title` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) The title of the map
* `description` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) The description of the map
* `imageUrl` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) The imageUrl of the map
* `lastModification` [**number**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number) An epoch timestamp in milliseconds
* `privateMap` [**boolean**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean) Optional, whether if this map is private to the user, or can be accessed by others via URL
* `loadParams` **any** A property to be passed to `downloadMap`

