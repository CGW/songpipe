The json files go in the data directory as before.

I've included an edited index.html with the 10 json files added to the pulldown.

The python script requires pylast
pip install pylast or go to https://github.com/pylast/pylast and follow 
instructions there. I installed via pip (python package index)

pylast version 1.0.0

Add api key and api secret to script before running.
Script has rate limiting applied, which I think is the wisest course of action.
See last.fm terms of service about rate limiting. To remove rate limiting
comment out the line towards the top of the script.


For each song edit the script and change the values on the 'root' dict
at the very bottom of the script. It will need song name, artist name,
and filename. No spaces in filename.
Running the script will write the json file to current working directory,
so you can run it within the data directory.

python /path/to/lastfm_network.py

It will output the names of similar songs as it finds them.
