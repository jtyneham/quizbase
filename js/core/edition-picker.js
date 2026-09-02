/**
 * Small reusable edition selector. It owns only the default interaction and
 * markup state; the parent game decides how an edition change is loaded.
 */
export function createEditionPicker({ root, editions, activeEditionId, onChoose }) {
  const picker = root.getElementById("editionPicker");
  const trigger = root.getElementById("editionPickerButton");
  const icon = root.getElementById("editionPickerIcon");
  const panel = root.getElementById("editionPanel");
  const activeEdition = editions.find((edition) => edition.id === activeEditionId);

  if (!picker || !trigger || !icon || !panel || !activeEdition) {
    throw new Error("Edition picker needs its controls and an active edition.");
  }

  function setOpen(open) {
    picker.classList.toggle("open", open);
    trigger.setAttribute("aria-expanded", String(open));
  }

  function renderOptions() {
    panel.replaceChildren(...editions.map((edition) => {
      const option = document.createElement("button");
      option.type = "button";
      option.className = "edition-option";
      option.setAttribute("role", "menuitem");
      option.setAttribute("aria-current", String(edition.id === activeEditionId));
      if (edition.id === activeEditionId) option.classList.add("active");

      const optionIcon = document.createElement("img");
      optionIcon.src = edition.icon;
      optionIcon.alt = "";
      optionIcon.setAttribute("aria-hidden", "true");

      const label = document.createElement("span");
      label.textContent = edition.name;
      option.append(optionIcon, label);
      option.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        setOpen(false);
        if (edition.id !== activeEditionId) onChoose(edition);
      });
      return option;
    }));
  }

  icon.src = activeEdition.icon;
  trigger.setAttribute("aria-label", `Edition: ${activeEdition.name}`);
  trigger.title = `Edition: ${activeEdition.name}`;
  renderOptions();

  trigger.addEventListener("click", (event) => {
    event.stopPropagation();
    setOpen(!picker.classList.contains("open"));
  });
  panel.addEventListener("click", (event) => event.stopPropagation());
  root.addEventListener("click", (event) => {
    if (!picker.contains(event.target)) setOpen(false);
  });

  return { close: () => setOpen(false) };
}
