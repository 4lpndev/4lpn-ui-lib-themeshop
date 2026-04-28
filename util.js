function create_section(name) {
  /*
    <div id="sakura">
        <p>sakura</p>
        <button onclick="navigator.clipboard.writeText(`${window.location + 'themes/sakura.json'}`.replace('index.html','')); alert('copied to clipboard')">copy theme to clipboard</button>
        <button onclick="window.location = './theme-previewer?theme=sakura'">preview theme</button>
    </div>
    */
  const divcont = document.createElement("div");
  divcont.id = name;
  const label = document.createElement("p");
  label.innerText = name
  const copytheme = document.createElement("button");
  copytheme.innerText = "copy theme url"
  const prev = document.createElement("button");
  prev.innerText = "preview theme"

  copytheme.addEventListener("click", () => {
    navigator.clipboard.writeText(
      `${window.location + "themes/sakura.json"}`.replace("index.html", ""),
    );
    alert("copied to clipboard");
  });

  prev.addEventListener("click", () => {
    window.location = `./theme-previewer?theme=${name}`
  })

  divcont.appendChild(label)
  divcont.appendChild(copytheme)
  divcont.appendChild(prev)
  document.body.appendChild(divcont)
}
