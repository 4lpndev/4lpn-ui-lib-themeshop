async function init() {
  const params = new URLSearchParams(window.location.search);
  const themename = params.get("theme");

  const uiTheme = new UiLibTheme(`../themes/${themename}.json`);
  const theme = await uiTheme.get_custom_theme();

  const ui = new UiLib(theme);
  const dbg = new UiLibDebug(theme);

  dbg.success("theme loaded");

  dbg.info("this is an information");
  dbg.success("yay it works!! :D");
  dbg.error("nooooo it doesn't work :(");

  ui.window("<span style='color: red'>4</span>lpn's UI lib demo", [
    "fit-content",
    "430px",
  ]);

  //for the tabs
  ui.create_tab_ctx(["0px", "-20px"]); //tab context
  const tab1 = ui.create_tab("aimbot", ["fit-content", "fit-content"]);
  const tab2 = ui.create_tab("misc", ["fit-content", "fit-content"]);
  const tab3 = ui.create_tab("visuals", ["fit-content", "fit-content"]);
  const tab4 = ui.create_tab("movement", ["fit-content", "fit-content"]);
  ui.append_tab_ctx(); //append tabs to window

  ui.append_window(); //render window to main screen

  //events and stuff
  tab1.addEventListener("click", () => {
    const label = ui.label("this is tab 1", ["20px", "50px"]);
    ui.infolabel(label, "woaaaa cool label!!!");
  });

  tab2.addEventListener("click", () => {
    const label = ui.label("this is tab 2", ["20px", "50px"]);
  });

  tab3.addEventListener("click", () => {
    const label = ui.label("this is tab 3", ["20px", "50px"]);
  });

  tab4.addEventListener("click", () => {
    const label = ui.label("this is tab 4", ["20px", "50px"]);
  });
}

init();
