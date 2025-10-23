# Big Damn MUSH
A dynamic, web-based character sheet system for World of Darkness tabletop RPGs! It's designed to integrate with PennMUSH, Evennia, and other online gaming environments that can interact with an external API. 

# Overview
This project provides a flexible framework for creating interactive character sheets. There is a character sheet builder with a React-based front end that takes care of the whole shooting match. There are also individual, vanilla JavaScript Web Components for people who want to build your own UIs, like some custom view for whatever HRs or expansion books you have in mind. The UI elements are styled with CSS variables, so if you use the UI part, you can have control of their appearance.

# Features
1. Character Sheet Builder
2. Custom Web Components
3. API

## Character Sheet Builder
The character builder handles the entire character creation process! Whoo! It currently does not allow you to save anything and what you can build with it are Vampire and Ghoul and Revenant characters. I'm working on adding the other spheres.  

### Supported Character Types
* **Vampire: the Masquerade:** Clans, bloodlines, ghould, revenants, both V20 and Dark Ages. As the Tremere are hideous wretches one and all, anyone using my framework agrees to modify their game world to reflect that blood magic in all forms does not exist (until I add it).

### Upcoming Support
* **Mage: the Ascension** is 2nd in line and has its stat definitions, etc. mostly in place!
* **Werewolf: the Apoclaypse** is 3rd in line.
* **Changeling: the Dreaming**
* **Wraith: the Oblivion**
* **Demon: the Fallen**
* **Hunter: the Reckoning**
* **Mummy: the Resurrection**

## Custom Web Components 
### Stat Rating
This component, `<stat-rating />`, gives you an individual stat display with the classic dot-based rating system (1-5, expandable to 10).  It has min/max constraints and ceiling limits for different character types (e.g. to throttle a Nosferatu's appearance to 0). There is event bubbling for stat changes.

Example:
```
<stat-rating 
  name="strength" 
  display-name="Strength" 
  value="3" 
  ceiling="5"
  min="1"
></stat-rating>
```

## Stat Column
The `<stat-column />` component is a container for grouping related stats with automatic totaling. 

Example:
```
<stat-column name="physical" floor="-3" max="7">
  <stat-rating name="strength" display-name="Strength" min="1" value="1"></stat-rating>
  <stat-rating name="dexterity" display-name="Dexterity" min="1" value="1"></stat-rating>
  <stat-rating name="stamina" display-name="Stamina" min="1" value="1"></stat-rating>
</stat-column>
```

## Stat Section
The `<stat-section />` component is an organizational component for grouping stat columns.

Example:
```
<stat-section name="attributes" display-name="Attributes">
  <stat-column name="physical">...</stat-column>
  <stat-column name="social">...</stat-column>
  <stat-column name="mental">...</stat-column>
</stat-section>
```

## Dropdown Select
The `<dropdown-select />` component is exactly that - a nice styled dropdown select. It releases an event when an item is selected so you can have reactionary effects (e.g. "When user selects Thaumaturgy, load available paths").

Example:
This presumes there is a 
```
<dropdown-select 
  name="shifter_type" 
  label="Tribe"
  depends-on="character_race"
></dropdown-select>
```

## Spendable Pool
This is a resource tracking component for expendable stats (willpower, blood pool, etc.), which has a visual distinction between permanent vs. temporary stat ratings.

```
<spendable-pool 
  name="willpower" 
  display-name="Willpower"
  rating="5"
  value="3"
  max="10"
></spendable-pool>
```

# API
The system connects to a backend API for stat definitions and character sheet/stat storage.  There are swagger docs for more information: see the individual docs in `src/server/routes` - individual route folders have an `api-docs` folder.  You also can run the project and go to `localhost:3000/api-docs`.

Some example endpoints 
```
GET  /api/monsters?books={books}
GET  /api/organizations/{monster}?books={books}&year={year}
GET  /api/stats/{category}?year={year}
POST /api/characters
PUT  /api/characters/{id}
```

# Getting Started
You're going to need TypeScript, Node, and in its current state, to have set up your own PostgreSQL database (have fun, son). You can ply me with gifts to give you the info necessary to connect to the SQL database I have everything on, which I don't have connection info here because the data keeps changing and I don't see the point (yet).  You can see schemas in `src\server\sql\schemas`. 
