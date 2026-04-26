function dragElement(elmnt) {
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    if (
      e.target.tagName === "INPUT" ||
      e.target.tagName === "SELECT" ||
      e.target.className === "checkbox" ||
      e.target.className === "textarea"
    ) {
    } else {
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    elmnt.style.top = elmnt.offsetTop - pos2 + "px";
    elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

//maybe removing, pointless.
class UiLibEvents {
  constructor() {
    this.listeners = {};
  }

  addEventListener(eventType, listener) {
    if (!this.listeners[eventType]) {
      this.listeners[eventType] = [];
    }
    this.listeners[eventType].push(listener);
  }

  dispatchEvent(eventType, eventData) {
    if (this.listeners[eventType]) {
      this.listeners[eventType].forEach((listener) => {
        listener(eventData);
      });
    }
  }

  removeEventListener(eventType, listener) {
    if (this.listeners[eventType]) {
      const index = this.listeners[eventType].indexOf(listener);
      if (index !== -1) {
        this.listeners[eventType].splice(index, 1);
      }
    }
  }
}

const events = new UiLibEvents();

class UiLibTheme {
  /**
   * used to load the theme
   * @param {string} url - only for loading the theme via url, obselete otherwise
   */
  constructor(url = "") {
    this._theme = {
      debug: {
        errorColor: "red",
        successColor: "green",
        infoColor: "#4C4CE4",
      },

      gui: {
        backgroundColor: "black",
        font: "monospace",
        textColor: "white",
        left: "-3px",
        top: "-20px",
        title: "",
        borderColor: "gray",
        borderType: "double",
        borderThickness: "3px",
        borderRadius: "0px",
        titleBorder: "double",
      },

      tabs: {
        backgroundColor: "black",
        font: "monospace",
        textColor: "white",
        left: "-3px",
        top: "-20px",
        title: "",
        borderColor: "gray",
        borderType: "double",
        borderThickness: "3px",
        borderRadius: "0px",
        selectedColor: "gray",
      },

      tab_ctx: {
        borderType: "double",
        borderColor: "gray",
        borderThickness: "3px",
        borderRadius: "0px",
        backgroundColor: "black",
        font: "monospace",
        textColor: "white",
      },

      buttons: {
        backgroundColor: "black",
        font: "monospace",
        textColor: "white",
        borderColor: "white",
        borderType: "double",
        borderThickness: "2px",
        borderRadius: "10px",
      },

      input: {
        backgroundColor: "black",
        font: "monospace",
        textColor: "white",
        borderColor: "white",
        borderType: "double",
        borderThickness: "2px",
        borderRadius: "10px",
      },

      dropdown: {
        backgroundColor: "black",
        font: "monospace",
        textColor: "white",
        borderColor: "white",
        borderType: "double",
        borderThickness: "2px",
        borderRadius: "10px",
      },

      checkbox: {
        backgroundColor: "black",
        font: "monospace",
        textColor: "white",
        borderColor: "white",
        borderType: "double",
        borderThickness: "2px",
        borderRadius: "5px",
        toggledColor: "white",
      },

      label: {
        backgroundColor: "none",
        font: "monospace",
        textColor: "white",
      },

      textarea: {
        backgroundColor: "black",
        font: "monospace",
        textColor: "white",
        borderColor: "white",
        borderType: "double",
        borderThickness: "2px",
        borderRadius: "5px",
      },
    };
    this._theme_url = url;
  }
  get_default_theme() {
    /**
     * simply loads the default theme, no arguments nessecary
     * @returns {this._theme}
     */
    return this._theme;
  }

  async get_custom_theme() {
    /**
     * loads theme via url
     * @param {string} url - the url to load
     * @returns {JSON} response - the theme in a json format
     */
    const response = await fetch(this._theme_url);
    if (!response.ok) {
      throw new Error("fetch response was not ok");
    }
    return await response.json();
  }
}

class UiLib {
  /**
   * for all the UI stuff
   * @param {JSON} theme - the theme loaded in UiLibTheme
   */
  constructor(theme) {
    this._mainWindow = null;
    this._theme = theme;
    this._tabs = [];
    this._tabctx = null;
    this._elements = [];
    this._currentTab = null;
    this._events = events;
    this._guiBind = "ShiftRight";
    this._guiHidden = false;
  }

  /**
   * 
   * @param {string[]} position - can be any css values for x and y
   */
  create_tab_ctx(position) {
    const tabappend = document.createElement("div");
    tabappend.style.width = "calc(100% - 77px)";
    tabappend.style.backgroundColor = this._theme.tabs.backgroundColor;
    tabappend.style.position = "relative";
    tabappend.style.display = "flex";
    tabappend.style.flexWrap = "nowrap";
    tabappend.style.left = position[0];
    tabappend.style.top = position[1];
    this._tabctx = tabappend;
  }

  append_tab_ctx() {
    /**
     * appends the tab ctx to the main window
     * doesn't return anything
     */
    this._mainWindow.appendChild(this._tabctx);
  }

  _unload_tab(tabObj) {
    tabObj.style.backgroundColor = this._theme.tabs.backgroundColor; //why is this here?????
    this._elements.forEach((elem) => {
      elem.remove();
    });
  }

  _setCurrentTab(tab) {
    this._currentTab = tab;

    this._tabs.forEach((t) => {
      if (t === tab) {
        t.style.backgroundColor = this._theme.tabs.selectedColor;
      } else {
        t.style.backgroundColor = this._theme.tabs.backgroundColor;
      }
    });
  }

  create_tab(tabname, dimentions) {
    /**
     * creates the tab and appends it in the tab ctx
     * @param {string} tabname - the name of the tab
     * @param {string[]} dimentions - the dimentions of the tab (any css values)
     * @returns {HTMLElement} tab - the tab
    */
    const tab = document.createElement("div");
    tab.innerText = tabname;
    tab.style.cursor = "pointer";
    tab.style.border = `${this._theme.tabs.borderThickness} ${this._theme.tabs.borderType} ${this._theme.tabs.borderColor}`;
    tab.style.backgroundColor = this._theme.tabs.backgroundColor;
    tab.style.position = "relative";
    tab.style.display = "inline-block";
    tab.style.color = this._theme.tabs.textColor;
    tab.style.fontFamily = this._theme.tabs.font;
    tab.style.width = dimentions[0];
    tab.style.height = dimentions[1];

    tab.style.display = "flex";
    tab.style.justifyContent = "center";
    tab.style.alignItems = "center";

    this._currentTab = tab;

    tab.addEventListener("click", () => {
      this._unload_tab(tab);
      this._setCurrentTab(tab);
    });

    this._tabctx.appendChild(tab);
    this._tabs.push(tab);

    return tab;
  }

  window(title, dimentions) {
    /**
     * creates the main window
     * @param {string} title - window title
     * @param {string[]} dimentions - window dimentions (any css values)
     * @returns {HTMLElement} this._mainWindow - the main window
     */
    const winTitle = document.createElement("h4");
    winTitle.style.position = "relative";
    winTitle.style.color = this._theme.gui.textColor;
    winTitle.style.left = this._theme.gui.left;
    winTitle.style.top = this._theme.gui.top;
    winTitle.style.borderTopLeftRadius = this._theme.gui.borderRadius;
    winTitle.style.width = "fit-content";
    winTitle.style.border = `${this._theme.gui.borderThickness} ${this._theme.gui.titleBorder} ${this._theme.gui.borderColor}`;
    winTitle.style.fontFamily = this._theme.gui.font;
    winTitle.innerHTML = title;

    this._mainWindow = document.createElement("div");
    this._mainWindow.style.zIndex = 999999;
    this._mainWindow.style.position = "absolute";
    this._mainWindow.style.width = `${dimentions[0]}`;
    this._mainWindow.style.height = `${dimentions[1]}`;
    this._mainWindow.style.border = `${this._theme.gui.borderThickness} ${this._theme.gui.borderType} ${this._theme.gui.borderColor}`;
    this._mainWindow.style.borderRadius = this._theme.gui.borderRadius;
    this._mainWindow.style.backgroundColor = this._theme.gui.backgroundColor;

    document.body.addEventListener("keydown", (e) => {
      if (e.code == this._guiBind) {
        this._guiHidden = !this._guiHidden;
        if (this._guiHidden) {
          this._mainWindow.style.display = "none";
        } else {
          this._mainWindow.style.display = "block";
        }
      }
    });

    this._mainWindow.appendChild(winTitle);
  }

  update_window() {
    /**
     * refreshes the window, honestly forgot why i added this
     */
    this._mainWindow.style.backgroundColor = th._theme.gui.backgroundColor;
  }

  colorpicker(position) {
    /**
     * creates a colorpicker element
     * @param {string[]} position - the position of the colorpicker
     * @returns {HTMLElement} cpicker - the colorpicker
     */
    const cpicker = document.createElement("input");
    cpicker.type = "color";
    cpicker.style.position = "absolute";
    cpicker.style.left = position[0];
    cpicker.style.top = position[1];

    this._mainWindow.appendChild(cpicker);

    this._elements.push(cpicker);

    return cpicker;
  }

  button(text, dimentions, position) {
    /**
     * creates a button on the window
     * @param {string} text - the text of the button
     * @param {string[]} dimentions - the dimentions of the button (any css values)
     * @param {string[]} position - the position of the button (any css values)
     * @returns {HTMLElement} btn - the button
     */
    const btn = document.createElement("button");
    btn.style.fontFamily = this._theme.buttons.font;
    btn.style.width = `${dimentions[0]}`;
    btn.style.height = `${dimentions[1]}`;
    btn.style.position = "relative";
    btn.style.left = `${position[0]}`;
    btn.style.top = `${position[1]}`;
    btn.style.backgroundColor = this._theme.buttons.backgroundColor;
    btn.style.color = this._theme.buttons.textColor;
    btn.style.border = `${this._theme.buttons.borderThickness} ${this._theme.buttons.borderType} ${this._theme.buttons.borderColor}`;
    btn.style.borderRadius = this._theme.buttons.borderRadius;
    btn.innerText = text;

    this._elements.push(btn);

    this._mainWindow.appendChild(btn);

    return btn;
  }

  slider(min, max, position) {
    /**
     * creates a value slider on the window
     * @param {number} min - the minimum value of the slider
     * @param {number} max - the maximum value of the slider
     * @param {string[]} position - the position of the slider (any css values)
     * @returns {HTMLElement} slider - the slider
    */
    const slider = document.createElement("input");
    slider.style.position = "relative";
    slider.type = "range";
    slider.min = min;
    slider.max = max;
    slider.style.color = this._theme.gui.textColor;
    slider.style.fontFamily = this._theme.gui.font;
    slider.style.left = `${position[0]}`;
    slider.style.top = `${position[1]}`;

    const val = document.createElement("span");
    let lrunit = position[0].replace(/[0-9.-]/g, "");
    val.style.position = "relative";
    val.style.color = this._theme.gui.textColor;
    val.style.fontFamily = this._theme.gui.font;
    val.innerText = slider.value;
    val.style.left = `${parseInt(position[0]) - 10}${lrunit}`;
    val.style.top = `${position[1]}`;

    slider.addEventListener("change", () => {
      val.innerText = slider.value;
    });

    this._elements.push(slider);
    this._elements.push(val);
    this._mainWindow.appendChild(val);
    this._mainWindow.appendChild(slider);

    return slider;
  }

  label(text, position, backgroundColorOn, isWaterMark) {
    /**
     * creates a text label on the window
     * @param {string} text - the text of the label
     * @param {string[]} position - the position of the label (any css values)
     * @param {boolean} backgroundColorOn - if the background color should be on or not
     * @param {boolean} isWaterMark - if the label is a watermark or not, if watermark, avoids being removed
     * @returns {HTMLElement} label - the label
    */
    const label = document.createElement("span");
    label.style.position = "relative";
    label.innerText = text;
    if (backgroundColorOn) {
      label.backgroundColor = this._theme.label.backgroundColor;
    } else {
      label.backgroundColor = "none";
    }
    label.style.color = this._theme.label.textColor;
    label.style.fontFamily = this._theme.label.font;
    label.style.left = `${position[0]}`;
    label.style.top = `${position[1]}`;

    if (isWaterMark) {
    } else {
      this._elements.push(label);
    }

    this._mainWindow.appendChild(label);

    return label;
  }

  input(placeholder, dimentions, position) {
    /**
     * creates a text input on the window
     * @param {string} placeholder - the placeholder of the input
     * @param {string[]} dimentions - the dimentions of the input (any css values)
     * @param {string[]} position - the position of the input (any css values)
     * @returns {HTMLElement} inp - the input
    */
    const input = document.createElement("input");
    input.placeholder = placeholder;
    input.style.position = "relative";
    input.style.left = `${position[0]}`;
    input.style.top = `${position[1]}`;
    input.style.width = `${dimentions[0]}`;
    input.style.height = `${dimentions[1]}`;
    input.style.border = `${this._theme.input.borderThickness} ${this._theme.input.borderType} ${this._theme.input.borderColor}`;
    input.style.backgroundColor = this._theme.gui.backgroundColor;
    input.style.color = this._theme.gui.textColor;
    this._mainWindow.appendChild(input);

    this._elements.push(input);

    return input;
  }

  checkbox(text, position, boxdim) {
    /**
     * creates a checkbox on the window
     * @param {string} text - the text of the checkbox
     * @param {string[]} position - the position of the checkbox (any css values)
     * @param {string[]} boxdim - the dimentions of the checkbox (any css values)
     * @returns {HTMLElement} checkbox - the checkbox
     */
    const checkbox = document.createElement("div");
    const label = document.createElement("span");
    checkbox.style.width = boxdim;
    checkbox.style.height = boxdim;
    checkbox.style.position = "relative";
    checkbox.style.border = `${this._theme.gui.borderThickness} ${this._theme.checkbox.borderType} ${this._theme.checkbox.borderColor}`;

    checkbox.style.left = position[0];
    checkbox.style.top = position[1];

    checkbox.classList.add("checkbox");

    label.style.fontFamily = this._theme.gui.font;
    label.style.position = "relative";
    label.style.left = `calc(${position[0]} + 30px)`;
    label.style.top = `calc(${position[1]} - 20px)`;
    label.style.color = this._theme.gui.textColor;
    label.innerText = text;

    let toggled = false;

    checkbox.addEventListener("click", () => {
      if (toggled) {
        checkbox.style.backgroundColor = this._theme.checkbox.backgroundColor;
        toggled = false;
      } else {
        checkbox.style.backgroundColor = this._theme.checkbox.toggledColor;
        toggled = true;
      }
    });

    this._elements.push(checkbox);
    this._elements.push(label);

    this._mainWindow.appendChild(checkbox);
    this._mainWindow.appendChild(label);

    return checkbox;
  }

  dropdown(options, dimentions, position) {
    /**
     * creates a dropdown menu on the window
     * @param {string[]} options - the options of the dropdown menu
     * @param {string[]} dimentions - the dimentions of the dropdown menu (any css values)
     * @param {string[]} position - the position of the dropdown menu (any css values)
     * @returns {HTMLElement} sel - the dropdown menu
     */
    const sel = document.createElement("select");
    sel.style.position = "relative";
    sel.style.backgroundColor = this._theme.dropdown.backgroundColor;
    sel.style.border = `${this._theme.dropdown.borderThickness} ${this._theme.dropdown.borderType} ${this._theme.dropdown.borderColor}`;
    sel.style.color = this._theme.dropdown.textColor;
    sel.style.borderRadius = this._theme.dropdown.borderRadius;
    sel.style.left = position[0];
    sel.style.top = position[1];
    sel.style.width = dimentions[0];
    sel.style.height = dimentions[1];
    options.forEach((opts) => {
      const opt = document.createElement("option");
      opt.value = opts;
      opt.innerText = opts;
      sel.appendChild(opt);
    });

    this._elements.push(sel);

    this._mainWindow.appendChild(sel);

    return sel;
  }

  textarea(dimentions, position) {
    /**
     * creates a textarea on the window
     * @param {string[]} dimentions - the dimentions of the textarea (any css values)
     * @param {string[]} position - the position of the textarea (any css values)
     * @returns {HTMLElement} textarea - the textarea
     */
    const textarea = document.createElement("textarea");
    textarea.classList.add("textarea");
    textarea.style.position = "relative";
    textarea.style.resize = "none";
    textarea.style.backgroundColor = this._theme.textarea.backgroundColor;
    textarea.style.border = `${this._theme.textarea.borderThickness} ${this._theme.textarea.borderType} ${this._theme.textarea.borderColor}`;
    textarea.style.color = this._theme.textarea.textColor;
    textarea.style.borderRadius = this._theme.textarea.borderRadius;
    textarea.style.left = position[0];
    textarea.style.top = position[1];
    textarea.style.width = dimentions[0];
    textarea.style.height = dimentions[1];

    this._elements.push(textarea);

    this._mainWindow.appendChild(textarea);

    return textarea;
  }

  append_window() {
    /**
     * simply appends the window on the page, call after adding all the components on the window
     */
    document.body.appendChild(this._mainWindow);
    dragElement(this._mainWindow);
  }

  delete_element(elem) {
    /**
     * removes an element from the window
     */
    elem.remove();
  }

  destroy_window() {
    /**
     * destroys/removes the window, can be useful for a "panic" mode
     */
    this._mainWindow.remove();
  }

  infolabel(elem, infotext) {
    /**
     * creates a label when hovering over with mouse and goes away when no longer hovering
     * @param {HTMLElement} elem - the element to add the info text to
     * @param {string} infotext - the description
    */
    let mx = 0;
    let my = 0;

    const label = document.createElement("p");
    label.style.backgroundColor = this._theme.gui.backgroundColor;
    label.style.position = "absolute";
    label.style.zIndex = "999999999";
    label.className = "infolabel";
    label.innerText = infotext;
    label.style.border = this._theme.gui.borderType;
    label.style.borderColor = this._theme.gui.borderColor;
    label.style.color = this._theme.gui.textColor;
    label.style.backgroundColor = this._theme.backgroundColor;
    label.style.pointerEvents = "none";
    label.style.fontFamily = this._theme.gui.font;

    document.addEventListener("mousemove", (e) => {
      mx = e.clientX;
      my = e.clientY;

      if (label.parentNode) {
        label.style.left = mx + 10 + "px";
        label.style.top = my + 10 + "px";
      }
    });

    elem.addEventListener("mouseenter", () => {
      if (!document.querySelector(".infolabel")) {
        document.body.appendChild(label);
      }
    });

    elem.addEventListener("mouseleave", () => {
      if (label.parentNode) {
        label.remove();
      }
    });
  }
}

class UiLibDebug {
  /**
   * for logging purposes, every functions of this class are pretty self explanatory and only require one param which is a string
   * @param {JSON} theme
   */
  constructor(theme) {
    this._theme = theme;
  }

  error(message) {
    console.log(
      "%c[4lpnUiLib]",
      `color: ${this._theme["debug"]["errorColor"]}`,
      message,
    );
  }

  success(message) {
    console.log(
      "%c[4lpnUiLib]",
      `color: ${this._theme["debug"]["successColor"]}`,
      message,
    );
  }

  info(message) {
    console.log(
      "%c[4lpnUiLib]",
      `color: ${this._theme["debug"]["infoColor"]}`,
      message,
    );
  }
}
