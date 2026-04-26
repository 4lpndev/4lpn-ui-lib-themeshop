const deftheme = {
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

const originalTheme = JSON.parse(JSON.stringify(deftheme));

function load_window() {
  let uiTheme = new UiLibTheme();
  uiTheme._theme = deftheme;

  const ui = new UiLib();
  ui._theme = uiTheme.get_default_theme();

  const dbg = new UiLibDebug(ui._theme);

  dbg.info("this is an information");
  dbg.success("yay it works!! :D");
  dbg.error("nooooo it doesn't work :(");

  ui.window("<span style='color: red'>4</span>lpn's UI lib demo", [
    "fit-content",
    "430px",
  ]);

  ui.create_tab_ctx(["0px", "-20px"]);
  const tab1 = ui.create_tab("aimbot", ["fit-content", "fit-content"]);
  const tab2 = ui.create_tab("misc", ["fit-content", "fit-content"]);
  const tab3 = ui.create_tab("visuals", ["fit-content", "fit-content"]);
  const tab4 = ui.create_tab("movement", ["fit-content", "fit-content"]);
  ui.append_tab_ctx();
  ui.append_window();

  tab1.addEventListener("click", () => {
    const label = ui.label("hover me!", ["20px", "50px"]);
    const slider = ui.slider(0, 10, ["-25px", "100px"]);
    const checkbox = ui.checkbox("checkbox", ["10px", "200px"], "20px");
    ui.infolabel(label, "woaaaa cool label!!!");
  });

  tab2.addEventListener("click", () => {
    ui.label("this is tab 2", ["20px", "50px"]);
    ui.dropdown(
      ["first option", "second option", "third option"],
      ["100px", "25px"],
      ["-50px", "100px"],
    );
    ui.button("button", ["100px", "25px"], ["-100px", "150px"]);
    ui.colorpicker(["100px", "300px"]);
  });

  tab3.addEventListener("click", () => {
    ui.label("this is tab 3", ["20px", "50px"]);
    ui.input("demo", ["100px", "25px"], ["-50px", "100px"]);
    ui.textarea(["150px", "50px"], ["-100px", "200px"]);
  });

  tab4.addEventListener("click", () => {
    ui.label("this is tab 4", ["20px", "50px"]);
  });
}

// 🔁 full UI refresh (no page reload)
function refreshUI() {
  document.body.innerHTML = '<div id="editor"></div>';
  load_window();
  createEditor(deftheme, document.getElementById("editor"));
}

function getValueByPath(obj, path) {
  return path.reduce((acc, key) => acc[key], obj);
}

function isColor(value) {
  const s = new Option().style;
  s.color = value;
  return s.color !== "";
}

function createEditor(obj, container, path = []) {
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    const currentPath = [...path, key];

    const wrapper = document.createElement("div");
    wrapper.style.marginLeft = "10px";

    const label = document.createElement("label");
    label.textContent = key + ": ";
    wrapper.appendChild(label);

    if (typeof value === "object" && value !== null) {
      const section = document.createElement("div");
      section.style.border = "1px solid gray";
      section.style.padding = "5px";
      section.style.margin = "5px 0";

      const title = document.createElement("div");
      title.textContent = key;
      title.style.fontWeight = "bold";

      section.appendChild(title);
      createEditor(value, section, currentPath);
      container.appendChild(section);
    } else {
      let input;

      if (isColor(value)) {
        input = document.createElement("input");
        input.type = "color";

        const temp = document.createElement("div");
        temp.style.color = value;
        document.body.appendChild(temp);
        const computed = getComputedStyle(temp).color;
        document.body.removeChild(temp);

        const rgb = computed.match(/\d+/g);
        if (rgb) {
          input.value =
            "#" + rgb.map((x) => (+x).toString(16).padStart(2, "0")).join("");
        }
      } else {
        input = document.createElement("input");
        input.type = "text";
        input.value = value;
      }

      // 🔥 change instead of input (prevents spam refresh)
      input.addEventListener("change", () => {
        const parent = getValueByPath(deftheme, path);

        if (!parent) {
          console.warn("Invalid path:", path);
          return;
        }

        parent[key] = input.value;

        const originalValue = getValueByPath(originalTheme, [...path, key]);
        const isModified = originalValue !== input.value;

        input.style.outline = isModified ? "2px solid orange" : "";

        console.log("Modified:", isModified, currentPath.join("."));

        // 🔁 refresh UI
        refreshUI();
      });

      wrapper.appendChild(input);
      container.appendChild(wrapper);
    }
  });
}

function download(text, name, type) {
        var a = document.createElement("a");
        var file = new Blob([text], { type: type });
        a.href = URL.createObjectURL(file);
        a.download = name;
        document.body.appendChild(a);
        a.click();
}

document.getElementById("export").addEventListener("click", () => {
  download(JSON.stringify(deftheme), "export.json", "text/json")
})

// 🚀 init
load_window();
createEditor(deftheme, document.getElementById("editor"));
