- data
  - DONE task1
    :LOGBOOK:
    CLOCK: [2024-11-10 Sun 23:18:40]--[2024-11-10 Sun 23:18:42] => 00:00:02
    CLOCK: [2024-11-10 Sun 23:19:12]--[2024-11-10 Sun 23:19:13] => 00:00:01
    :END:
  - DONE task2
    :LOGBOOK:
    CLOCK: [2024-11-10 Sun 23:18:44]--[2024-11-10 Sun 23:18:46] => 00:00:02
    :END:
  - DOING task3
    :LOGBOOK:
    CLOCK: [2024-11-10 Sun 23:18:09]--[2024-11-10 Sun 23:18:15] => 00:00:06
    CLOCK: [2024-11-10 Sun 23:25:15]
    :END:
  - TODO task4
    :LOGBOOK:
    CLOCK: [2024-11-10 Sun 23:19:18]--[2024-11-10 Sun 23:19:19] => 00:00:01
    :END:
  - DONE task5
    :LOGBOOK:
    CLOCK: [2024-11-10 Sun 23:19:04]--[2024-11-10 Sun 23:19:13] => 00:00:09
    :END:
    - DONE task5-1
      :LOGBOOK:
      CLOCK: [2024-11-10 Sun 23:19:06]--[2024-11-10 Sun 23:19:10] => 00:00:04
      :END:
    - DONE task5-2
      :LOGBOOK:
      CLOCK: [2024-11-10 Sun 23:19:09]--[2024-11-10 Sun 23:19:11] => 00:00:02
      CLOCK: [2024-11-10 Sun 23:20:16]--[2024-11-10 Sun 23:20:18] => 00:00:02
      :END:
- {{renderer :vegalite,tasks_current=(and (page <% current page %>) (task TODO DOING DONE))}}
  collapsed:: true
  - ```json
    {
      "data": {
        "name": "tasks_current"
      },
      "mark": "bar",
      "encoding": {
        "x": { "aggregate": "count", "type": "quantitative" },
        "color": { "field": "marker", "type": "nominal" }
      }
    }
    ```
- {{renderer :vegalite,tasks=(and (page <% current page %>) (task TODO DOING DONE))}}
  collapsed:: true
  - ```json
    {
      "data": { "name": "tasks" },
      "transform": [
        { "as": "taskTitle", "calculate": "datum.ext.logbook.title" },
        {
          "as": "taskStartMin",
          "calculate": "toDate(datum.ext.logbook.startMin)"
        },
        { "as": "taskEndMax", "calculate": "toDate(datum.ext.logbook.endMax)" }
      ],
      "layer": [
        {
          "mark": { "type": "rect" },
          "encoding": {
            "y": { "field": "taskTitle", "type": "nominal", "sort": "x" },
            "x": { "field": "taskStartMin", "type": "temporal" },
            "x2": { "field": "taskEndMax", "type": "temporal" },
            "color": { "field": "marker", "type": "nominal" }
          }
        },
        {
          "mark": { "type": "text", "align": "left", "dx": 5 },
          "encoding": {
            "x": { "field": "taskEndMax", "type": "temporal" },
            "y": {
              "field": "taskTitle",
              "type": "nominal",
              "sort": "taskEndMax"
            },
            "text": { "field": "taskTitle", "type": "nominal" }
          }
        }
      ]
    }
    ```
