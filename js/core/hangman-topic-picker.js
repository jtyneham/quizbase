import { bindOutsideDismiss } from "./ui.js";

/** Shared topic picker for both Hangman variants. */
export function createHangmanTopicPicker({
  root,
  topics,
  supportsFeatured = false,
  featuredModeLabel = "General",
  initialTopics = [],
  initialFeaturedMode = false,
  onApply
}) {
  const trigger = root.getElementById("topicsBtn");
  const count = root.getElementById("topicsCount");
  const overlay = root.getElementById("topicsOverlay");
  const grid = root.getElementById("topicsGrid");
  const closeButton = root.getElementById("topicsClose");
  const selectAllButton = root.getElementById("selectAllTopics");
  const clearButton = root.getElementById("clearTopics");
  const cancelButton = root.getElementById("cancelTopics");
  const applyButton = root.getElementById("applyTopics");

  let selectedTopics = new Set(initialTopics);
  let draftTopics = new Set(initialTopics);
  let featuredMode = Boolean(initialFeaturedMode);
  let draftFeaturedMode = Boolean(initialFeaturedMode);

  function updateLabel() {
    if (supportsFeatured && featuredMode) {
      count.textContent = featuredModeLabel;
    } else if (selectedTopics.size === topics.length) {
      count.textContent = "All";
    } else {
      count.textContent = String(selectedTopics.size);
    }
  }

  function renderChoices() {
    grid.replaceChildren();

    if (supportsFeatured) {
      const featuredButton = document.createElement("button");
      featuredButton.type = "button";
      featuredButton.className = "topic-chip featured-topic";
      featuredButton.textContent = featuredModeLabel;
      featuredButton.classList.toggle("selected", draftFeaturedMode);
      featuredButton.addEventListener("click", () => {
        draftFeaturedMode = true;
        draftTopics.clear();
        renderChoices();
      });
      grid.appendChild(featuredButton);
    }

    topics.forEach((topic) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "topic-chip";
      button.textContent = topic;
      button.classList.toggle(
        "selected",
        !draftFeaturedMode && draftTopics.has(topic)
      );
      button.addEventListener("click", () => {
        draftFeaturedMode = false;
        if (draftTopics.has(topic)) {
          draftTopics.delete(topic);
        } else {
          draftTopics.add(topic);
        }
        renderChoices();
      });
      grid.appendChild(button);
    });
  }

  function open() {
    draftTopics = new Set(selectedTopics);
    draftFeaturedMode = featuredMode;
    renderChoices();
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
  }

  function close() {
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
  }

  function apply() {
    if (!draftFeaturedMode && draftTopics.size === 0) return;

    featuredMode = draftFeaturedMode;
    selectedTopics = new Set(draftTopics);
    updateLabel();
    close();
    onApply?.(getState());
  }

  function getState() {
    return {
      selectedTopics: new Set(selectedTopics),
      featuredMode
    };
  }

  trigger.addEventListener("click", open);
  closeButton.addEventListener("click", close);
  cancelButton.addEventListener("click", close);
  selectAllButton.addEventListener("click", () => {
    draftFeaturedMode = false;
    draftTopics = new Set(topics);
    renderChoices();
  });
  clearButton.addEventListener("click", () => {
    draftFeaturedMode = false;
    draftTopics.clear();
    renderChoices();
  });
  applyButton.addEventListener("click", apply);
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) close();
  });
  bindOutsideDismiss(root, overlay, () => {
    if (overlay.classList.contains("open")) close();
  }, trigger);

  updateLabel();
  return { close, getState };
}
