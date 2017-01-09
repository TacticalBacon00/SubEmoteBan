# SubEmoteBan
Creates a word filter for your twitch chat, blocking subscriber emotes, but allowing real words.

##Usage
1. Install Node on your machine from https://nodejs.org/ or a repository from apt-get
2. Download the github files from https://github.com/TacticalBacon00/SubEmoteBan/archive/master.zip
3. Extract the zip to a folder and navigate to it in your command line
4. Run **npm install** in the command line
5. Run the program with **node app.js**

##What this does
This program downloads Webster's Unabridged Dictionary (https://github.com/adambom/dictionary) and the latest subscriber emotes on Twitch.tv (https://twitchemotes.com/apidocs), then runs a comparison to see if there emotes that match real words in the dictionary. If a match is found, the emote is removed from the list of words to ban.
The final list of emotes, minus real words, will be saved in /output/blacklist.txt
Simply copy/paste this list into your banned words list on your twitch channel settings page (https://www.twitch.tv/settings/channel), then save the changes to apply the emote filter to your channel.
