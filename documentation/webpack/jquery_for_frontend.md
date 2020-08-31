# Using jQuery for frontend functionality.

## Example

An example of this is here: <https://github.com/dtomlinson91/panaetius-theme/tree/modal/frontend-jquery>.

Look at:

- `./src/js/App.js` - `testModal` function.
- `./src/mainGlobal.js` - implementing this function.

## Documentation

If you want to control the frontend, you can use jQuery. One example would be using jQuery to execute a function if a button (with a css id) is pressed.

If you are using the standard structure for webpack:

- Create a function in `app.js` that does the jQuery action you want.
- Import it into `main.js` like usual.

This is most useful for clicking on things, or having something run after a set period of time.

An example jQuery might be to do something on click:

````javascript
    $("#modal-button").on("click", () => {
      $("#exampleModalCenter").modal("toggle");
    });
    ```
````
