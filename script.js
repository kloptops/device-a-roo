(function () {
      // --- UPDATED: Formatted for readability ---
      const tagDefinitions = {
        "Features": {
            "lowres": "Low Resolution",
            "hires": "High Resolution",
            "wide": "Wider than 640px",
            "opengl": "OpenGL Support",
            "power": "More Power",
            "ultra": "Even More Power!!",
            "analog_0": "0 Analog Sticks",
            "analog_1": "1 Analog Stick",
            "analog_2": "2 Analog Sticks",
        },
        "Custom Firmware (CFW)": {
            "amberelec": "AmberELEC",
            "arkos (wummle)": "ArkOS wummle fork",
            "arkos": "ArkOS",
            "batocera": "Batocera",
            "emuelec": "EmuELEC",
            "knulli": "Knulli",
            "muos": "muOS",
            "retrodeck": "RetroDECK",
            "rocknix": "ROCKNIX",
            "thera": "TheRA",
            "trimui": "TrimUI Firmware",
        },
        "Anbernic Devices": {
            "rg-arc-d": "Anbernic RG ARC-D",
            "rg-arc-s": "Anbernic RG ARC-S",
            "rg28xx": "Anbernic RG28XX",
            "rg34xx-h": "Anbernic RG34XX-H",
            "rg34xx-sp": "Anbernic RG34XX-SP",
            "rg351mp": "Anbernic RG351MP",
            "rg351p": "Anbernic RG351P/M",
            "rg351v": "Anbernic RG351V",
            "rg353m": "Anbernic RG353M",
            "rg353ps": "Anbernic RG353P/S",
            "rg35xx-h": "Anbernic RG35XX-H",
            "rg35xx-plus": "Anbernic RG35XX-PLUS",
            "rg35xx-sp": "Anbernic RG35XX-SP",
            "rg40xx-h": "Anbernic RG40XX-H",
            "rg40xx-v": "Anbernic RG40XX-V",
            "rg503": "Anbernic RG503",
            "rg552": "Anbernic RG552",
            "rgcubexx": "Anbernic RGCUBEXX",
        },
        "Powkiddy Devices": {
            "rgb10": "Powkiddy RGB10",
            "rgb10max3": "Powkiddy RGB10MAX3",
            "rgb10max3pro": "Powkiddy RGB10MAX3 Pro",
            "rgb20s": "Powkiddy RGB20S",
            "rgb30": "Powkiddy RGB30",
            "rk2023": "Powkiddy RK2023",
            "x55": "Powkiddy X55",
        },
        "Other Devices": {
            "ace": "Gameforce Ace",
            "chi": "Gameforce Chi",
            "oga": "Hardkernel ODROID GO Advance",
            "ogs": "Hardkernel ODROID GO Super",
            "ogu": "Hardkernel ODROID GO Ultra",
            "gkd-bubble": "GKD Bubble",
            "gkd-pixel2": "GKD Pixel 2",
            "steamdeck": "SteamDeck",
            "odin-2": "AYN Odin 2/Mini/Portal",
            "rp5": "Retroid Pocket 5",
            "rpmini": "Retroid Pocket Mini",
            "trimui-brick": "TrimUI Brick",
            "trimui-smart-pro": "Trimui Smart Pro (Teaspoon)",
            "r33s": "R33S Retro Handheld",
            "r35s": "R35S Retro Handheld",
            "r36s": "R36S Retro Handheld",
            "xu10": "MagicX XU10",
        },
        "Screen Resolutions": {
            "1920x1152": "1920x1152 Resolution",
            "1920x1080": "1920x1080 Resolution",
            "1280x960": "1280x960 Resolution",
            "1280x800": "1280x800 Resolution",
            "1280x720": "1280x720 Resolution",
            "1024x768": "1024x768 Resolution",
            "960x544": "960x544 Resolution",
            "854x480": "854x480 Resolution",
            "720x720": "720x720 Resolution",
            "720x480": "720x480 Resolution",
            "640x480": "640x480 Resolution",
            "480x320": "480x320 Resolution",
        },
        "Aspect Ratios": {
            "16:10": "Aspect Ratio 16:10",
            "16:9": "Aspect Ratio 16:9",
            "4:3": "Aspect Ratio 4:3",
            "1:1": "Aspect Ratio 1:1",
            "30:17": "Aspect Ratio 30:17",
            "3:2": "Aspect Ratio 3:2",
            "427:240": "Aspect Ratio 427:240",
            "5:3": "Aspect Ratio 5:3",
        },
        "Hardware: Processors": {
            "aarch64": "64-bit ARM (aarch64)",
            "armhf": "32-bit ARM (armhf)",
            "x86_64": "64-bit x86 (x86_64)",
        },
        "Hardware: RAM": {
            "16gb": "16GB RAM",
            "8gb": "8GB RAM",
            "4gb": "4GB RAM",
            "2gb": "2GB RAM",
            "1gb": "1GB RAM",
        },
        "Miscellaneous": {
            "restore": "Used by the restore PortMaster port.",
        },
      };

  let deviceDataGlobal = {};
  let runtimesInfo = {};
  let portsDataGlobal = {};
  let allTags = new Set();

  const editor = CodeMirror.fromTextArea(document.getElementById("requirements"), {
    mode: "application/json", lineNumbers: true, tabSize: 2,
    gutters: ["CodeMirror-linenumbers", "CodeMirror-lint-markers"], lint: true,
  });

  async function fetchDeviceData() {
    const response = await fetch("https://raw.githubusercontent.com/PortsMaster/PortMaster-Info/refs/heads/main/device_info.json");
    deviceDataGlobal = await response.json();
  }
  
  async function fetchPortsAndRuntimes() {
    const runtimesResponse = await fetch("https://raw.githubusercontent.com/PortsMaster/PortMaster-New/refs/heads/main/runtimes/runtimes.json");
    const runtimesJson = await runtimesResponse.json();
    runtimesInfo = {};
    for (const [runtimeFilename, runtimeData] of Object.entries(runtimesJson)) {
      if (runtimeData && runtimeData.arch) {
        runtimesInfo[runtimeFilename] = Object.keys(runtimeData.arch);
      }
    }
    
    const portsResponse = await fetch("https://raw.githubusercontent.com/PortsMaster/PortMaster-Info/refs/heads/main/ports.json");
    portsDataGlobal = await portsResponse.json();
  }
  
  function extractAllTags() {
    allTags.clear();
    for (const model in deviceDataGlobal) {
      for (const fw in deviceDataGlobal[model]) {
        (deviceDataGlobal[model][fw].capabilities || []).forEach(c => allTags.add(c));
      }
    }
    renderTagSidebar();
  }

  function getTagDescription(tag) {
    for (const category in tagDefinitions) {
        if (tagDefinitions[category][tag]) {
            return tagDefinitions[category][tag];
        }
    }
    return null;
  }
  
  function customSort(tags, category) {
    if (category === "Screen Resolutions") {
        return tags.sort((a, b) => parseInt(b.split('x')[0], 10) - parseInt(a.split('x')[0], 10));
    }
    if (category === "Hardware: RAM") {
        return tags.sort((a, b) => parseInt(b.replace('gb', ''), 10) - parseInt(a.replace('gb', ''), 10));
    }
    return tags.sort();
  }

  function renderTagSidebar() {
    const container = document.getElementById("tag-list");
    container.innerHTML = '';
    const unknownTags = [];
    allTags.forEach(tag => {
        if (getTagDescription(tag) === null) { unknownTags.push(tag); }
    });
    for (const [category, tagsInCategory] of Object.entries(tagDefinitions)) {
        const activeTags = Object.keys(tagsInCategory).filter(tag => allTags.has(tag));
        if (activeTags.length === 0) continue;
        const section = document.createElement('details');
        section.open = ["Features", "Custom Firmware (CFW)", "Anbernic Devices"].includes(category);
        const summary = document.createElement('summary');
        summary.textContent = category;
        section.appendChild(summary);
        customSort(activeTags, category).forEach(tag => {
            const div = document.createElement('div');
            div.className = 'tag-entry';
            div.innerHTML = `<code>${tag}</code>— ${tagsInCategory[tag]}`;
            section.appendChild(div);
        });
        container.appendChild(section);
    }
    if (unknownTags.length > 0) {
        const section = document.createElement('details');
        section.open = true;
        const summary = document.createElement('summary');
        summary.textContent = "Unknown";
        summary.style.color = "var(--error-color)";
        section.appendChild(summary);
        unknownTags.sort().forEach(tag => {
            const div = document.createElement('div');
            div.className = 'tag-entry';
            div.innerHTML = `<code>${tag}</code> — No description`;
            section.appendChild(div);
        });
        container.appendChild(section);
        console.log("%c--- Found Unknown Tags! Add these to tagDefinitions: ---", "color: orange; font-weight: bold;");
        console.log(JSON.stringify(unknownTags, null, 2));
    }
  }

  function buildRequirements(portInfo) {
    const attr = portInfo.attr || {};
    const reqs = Array.isArray(attr.reqs) ? [...attr.reqs] : [];
    let runtime = attr.runtime;

    if (Array.isArray(runtime) && runtime.length === 0) runtime = null;
    if (typeof runtime === "string" && (runtime === "" || runtime === "blank")) runtime = null;

    if (runtime !== null) {
      if (typeof runtime === "string") runtime = [runtime];
      for (let r of runtime) {
        if (!r.endsWith('.squashfs')) r += '.squashfs';
        const arches = runtimesInfo[r] || [];
        if (arches.length > 0) reqs.push(arches.join('|'));
      }
    } else {
      const arch = portInfo.attr.arch; // Use top-level arch if present
      if (Array.isArray(arch) && arch.length > 0) {
        reqs.push(arch.join('|'));
      }
    }
    return reqs;
  }

  function matchRequirements(capabilities, requirements) {
    if (requirements.length === 0) return [true, []];
    let failedReasons = [];

    for (let req of requirements) {
      if (req === "") continue;
      let matchNot = req.startsWith("!");
      if (matchNot) req = req.slice(1);

      const passed = req.includes("|")
        ? req.split("|").some(r => capabilities.includes(r)) === !matchNot
        : capabilities.includes(req) === !matchNot;

      if (!passed) failedReasons.push((!matchNot ? "Requires: " : "Excluded if: ") + req);
    }
    return [failedReasons.length === 0, failedReasons];
  }
  
  window.openPortModal = function() {
    if (!portsDataGlobal.ports) {
        alert("Port data is still loading, please try again in a moment.");
        return;
    }
    document.getElementById("port-filter-input").value = "";
    renderPortList();
    document.getElementById("port-modal").style.display = "flex";
  }

  window.closePortModal = function() {
    document.getElementById("port-modal").style.display = "none";
  }

  window.renderPortList = function(filter = "") {
    const listContainer = document.getElementById("port-list");
    listContainer.innerHTML = "";
    const filterLower = filter.toLowerCase();

    const sortedPortIds = Object.keys(portsDataGlobal.ports).sort((a, b) => {
        const nameA = (portsDataGlobal.ports[a].attr.title || a).toLowerCase();
        const nameB = (portsDataGlobal.ports[b].attr.title || b).toLowerCase();
        return nameA.localeCompare(nameB);
    });

    for (const portId of sortedPortIds) {
        const port = portsDataGlobal.ports[portId];
        const portName = port.attr.title || portId;

        if (portName.toLowerCase().includes(filterLower)) {
            const item = document.createElement("div");
            item.className = "port-list-item";
            item.textContent = portName;
            item.onclick = () => selectPort(portId);
            listContainer.appendChild(item);
        }
    }
  }

  window.selectPort = function(portId) {
    const originalPortData = portsDataGlobal.ports[portId];
    if (originalPortData) {
        const portDataForEditor = JSON.parse(JSON.stringify(originalPortData));

        delete portDataForEditor.source;
        delete portDataForEditor.rating;
        if (portDataForEditor.attr) {
            delete portDataForEditor.attr.avail;
        }

        editor.getDoc().setValue(JSON.stringify(portDataForEditor, null, 2));
        closePortModal();
        filterDevices();
    }
  }

  window.filterDevices = function () {
    let rawInput = editor.getValue();
    let requirements = [];

    try {
      const parsed = JSON.parse(rawInput);
      if (Array.isArray(parsed)) requirements = parsed;
      else if (typeof parsed === 'object' && parsed !== null) requirements = buildRequirements(parsed);
      else throw new Error("Input is not a valid array or object.");
    } catch (e) {
      alert("Cannot check compatibility: The input is not valid JSON.\nPlease fix the errors indicated in the editor.");
      return;
    }

    const sortedFirmwares = [...new Set(Object.values(deviceDataGlobal).flatMap(Object.keys))].sort();
    const sortedModels = Object.keys(deviceDataGlobal).sort();
    
    let html = '<table><thead><tr><th>Device</th>';
    sortedFirmwares.forEach(fw => html += `<th>${fw}</th>`);
    html += '</tr></thead><tbody>';

    for (const model of sortedModels) {
      html += `<tr><td>${model}</td>`;
      for (const fw of sortedFirmwares) {
        const info = deviceDataGlobal[model][fw];
        if (info) {
          const [passed, reasons] = matchRequirements(info.capabilities || [], requirements);
          const descriptiveReasons = reasons.map(reason => {
            const [prefix, rawTags] = reason.split(': ');
            const descriptiveTags = rawTags.split('|').map(tag => getTagDescription(tag) || tag).join(' or ');
            return `${prefix}: ${descriptiveTags}`;
          });
          const tooltip = passed ? '' : ` title="${descriptiveReasons.join('\n')}"`;
          html += `<td class="${passed ? 'check' : 'cross'}"${tooltip}>${passed ? '✅' : '❌'}</td>`;
        } else {
          html += `<td>—</td>`;
        }
      }
      html += '</tr>';
    }
    html += '</tbody></table>';
    document.getElementById("table-container").innerHTML = html;
  };
  
  async function init() {
    try {
      await Promise.all([fetchDeviceData(), fetchPortsAndRuntimes()]);
      extractAllTags();
      filterDevices();
    } catch (error) {
      console.error("Failed to initialize application:", error);
      alert("Failed to fetch necessary data. Please check your internet connection and the browser console for more details. If you are running this from a local file, you must use a local web server.");
    }
  }

  init();
})();