# Overview 

The official documentation on Kepler.gl is somewhat sparse.

In working on adding custom panels, it has become clear that this functionality 
(via the CustomPanelsFactory route) is both very poorly documented, and also 
the example application that is meant to demo this functionality is currently 
(as of 2021-06-17) broken. 

# General component hierarchy 

The following hierarchy is not exactly correct as I have skipped intermediate 
components such as `<IntlProvider>`, `<ThemeProvider>`, `<GlobalStyle>`, etc. 

The focus here is on components that we will most likely want to modify. 


## `<KeplerGL>`

```
<KeplerGL>
    <NotificationPanel {notifications via props.uiState.notifications/>
    <SidePanel {no panels passed in here!}/> (if !uiState.readOnly && !readOnly)
    <div>
        {mapContainers}
    </div>
    <PlotContainer/> (if isExportingImage)
    <GeoCoderPanel/> (if interactionConfig.geocoder.enabled)
    <BottomWidget/>
    <ModalContainer/>
</KeplerGL>
```

## `<SidePanel>`

```
<SidePanel>
    <Sidebar>
        <PanelHeader/>
        <PanelToggle {panels passed in here!}/>
        <SidePanelContent>
            <PanelTitle/>
            Optionally shows the standard panels if they're selected 
            The standard panels here are: 
            * <LayerManager/>
            * <FilterManager/>
            * <InteractionManager/>
            * <MapManager/>
            Now comes the <CustomPanels> element! 
            But this cannot show if it has not been selected 
            via the `activeSidePanel` property, which is the issue, we are having. 
        </SidePanelContent>
    <Sidebar/>
</SidePanel>
```

`<SidePanel>` technically does have a `panels` prop! 
But as noted above, this is not passed in via the standard `<KeplerGL>` component
and instead is set to a default: `SIDEBAR_PANELS`.

This appears to be problematic as `<PanelToggle>` which is used to switch 
between panels, uses `panels` to list the available panels!


## Adding custom panels 

We have added `<CustomPanels>` via the `<CustomPanelsFactory>` pattern. 
However, the problem has been in getting the additional panels to be listed 
in the `panels` attribute of the `<SidePanel>`. 

This is not at all clear in the `replace-component` example (non-functional) 
in the Kepler.GL official repo. 

I have filed a bug report for this 
(https://github.com/keplergl/kepler.gl/issues/1508) but with a list 
of ~294 open bug reports I would not expect a fast response to this. 

Instead, so far, it seems to me that there are two routes to getting this 
working properly: 

a) Replace `<KeplerGL>` with our own component that passes through 
   a `panels` property. 
b) Dig further into how to set the `SIDEBAR_PANELS` 
   (without having to work on a full KeplerGL repo clone). 


### Option a: Replacing KeplerGL

This seems to be a non-ideal option at the moment, as it would 
involve copy-pasting the current `kepler-gl.js` file (in `components`)
and making the edits required to pass-through `panels`. 

The reason it's not ideal, is because future changes to the core `KeplerGL`
will then always need to be mirrored in our custom component. 


### Option b: Digging further to figure out if/how we can set `panels`

This would be ideal, and of course should be how this is done internally, 
but so far the example app does not seem to be working so it's not clear 
what the best route to achieving this is. 

In theory, the `panels` attribute should have been internally updated 
when a modified `<CustomPanels>` is detected (or so I would think), but
this does not appear to be the case.

The *only* referece to `panels` (or `PANEL`) in the example app is as an 
attribute of the `<CustomPanels>` which I have set, but does not seem to 
affect the `panels` attribute of the outer `<SidePanel>`


