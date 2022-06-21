# YADA (Yet Another Dataflow Attempt)

 <img width="300" alt="Screen Shot 2022-05-31 at 9 39 05 PM" src="https://user-images.githubusercontent.com/27078897/171679946-9c6dbce3-871a-41c7-8ec7-2b8d6825be00.gif">

Some design considerations for YADA

- Nodes can be defined with a simple JS object. This structure also enables some rendering templates which can help unify the UI. Arbitrary HTML can still be included in the "view" function. Note also some explicit type declarations on inputs and outputs. These can be strictly enforced and also allow for intelligent inference of default values.

 <img width="400" src="https://user-images.githubusercontent.com/27078897/171680102-47d1826a-7f33-4d87-b135-02ea99579fb4.png">
 
- Adding a toolbox to the UI with search functionality and the ability to drag and drop new nodes. Would be nice to add search by type and some of Alan's ideas for assistive features based on type searching.

 <img width="400" src="https://user-images.githubusercontent.com/27078897/171680150-d48b0c01-0c6a-48b8-9bf2-80a744f27f9a.gif">

- Edges can be plugged in and unplugged by dragging.

 <img width="400" src="https://user-images.githubusercontent.com/27078897/171680171-1ed04bad-cca4-485d-a81b-a4180beaefe2.gif">

- A constrained but consistent execution policy. In this case each node can be evaluated on demand which also evaluates all dependencies of that node. Quentin and I spent some time discussing different approaches to this and took inspiration from AliceVision. Note also the interface element for editing node inputs, it's similar to xod's approach I believe.

 <img width="400" src="https://user-images.githubusercontent.com/27078897/171680225-5ad19a69-e0aa-4b2a-b54f-16407e959b6f.gif">


# TODO

- evaluate node on timer
- tensor data
- create evaluation model
  - should I support cycles
  - how is evaluation triggered
    - on wiring?
    - on run
    - on trigger event for nodes
- add view property to nodes
  - should I support arbitrary interfaces?
- add input fields
  - box
  - slider
  - option selection
  - curve editor
- add type system
- node bundling
- search by type inputs
- support asynchronous node evaluation
  - web workers in nodes
- custom script writing
- don't eval fresh (not stale) edges
- add trigger input
- add timers
- better track stale edges
- [x] save
- [x] upload
- fix bug with inputs
- get default values from types
- [x] add selection box
- [x] add drag and drop from toolbox
- [x] implement search
- [x] add node select
- [x] add multiple node selection/dragging
- [x] delete nodes
- [x] fix wire rendering
  - could implement with panZoom on svg as well, probably would be preferable
