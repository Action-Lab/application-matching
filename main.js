// Links to published CSV spreadsheets with responses
var partnersURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQNIVsp1OfyIKxMwNxk9m1fKY13QDpye-Od9ZWwrBIlEe2TU8Pmjq30euL2D-FI6hGnUCJ8CvBUN2IN/pub?gid=307810549&single=true&output=csv';
var studentsURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTMuePeOwTvmHrJ-1v6kikGlN0NLQJPHczgQ3njmICiAtzmjHOu6J9zT2xwJGmF5l3fgynOVns09uKk/pub?gid=1986187034&single=true&output=csv';
var facultyURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQWcaCg7awhsoGnVbqTM5rFrmSq1TP_OaJ2TULWpfDdtBtBw66M2XPyihX1keA9kb053F7epZIMKGBo/pub?gid=661922043&single=true&output=csv';


// Fetch Partners CSV using PapaParse
Papa.parse(partnersURL, {
	download: true,
  header: true,
	complete: function(result) {
    processData(result.data);
	}
});


// Function to remove special characters form string `s`
var stripSpecialCharacters = function(s) {
  return s.replace(/[^\w]/gi, '');
}


// Callback function for once Partners CSV is loaded
function processData(data) {

  for (var i in data) {
    if (data[i].Display !== 'y') continue;

    var team = data[i].Title;
    if (!team) continue;

    $('body').append('<div class="project-div" id="project-' + stripSpecialCharacters(team) + '"></div>');
    var div = '#project-' + stripSpecialCharacters(team);

    var project = data[i]['Project'];
    var products = data[i]['Products'];
    var research = data[i]['Research'];
    var mission = data[i]['Mission'];
    var learn = data[i]['Learn'];

    // These might be multiple people
    var websites = data[i]['Website'].split(';').map(function(x) {
      x = $.trim(x);
      if (x && x.indexOf('http') !== 0) {
        x = 'http://' + x;
      }
      return $.trim(x)
    });
    var emails = data[i]['Email'].split(';').map(function(x) {return $.trim(x)});
    var names = data[i]['Name'].split(';').map(function(x) {return $.trim(x)});
    var orgs = data[i]['Organization'].split(';').map(function(x) {return $.trim(x)});

    var namesFormatted = '';
    for (var j in names) {
      if (namesFormatted !== '') namesFormatted += ', ';
      if (emails[j]) {
        namesFormatted += '<a href="mailto:' + emails[j] + '">' + names[j] + '</a>';
      } else {
        namesFormatted += names[j];
      }
    }

    var orgsFormatted = '';
    for (var j in orgs) {
      if (orgsFormatted !== '') orgsFormatted += ', ';
      if (websites[j]) {
        orgsFormatted += '<a href="' + websites[j] + '">' + orgs[j] + '</a>';
      } else {
        orgsFormatted += orgs[j];
      }
    }

    $(div).append('<h1>' + team + ' Project</h1>');
    $(div).append('<div class="hr" style="background:#' + Math.random().toString(16).substr(-6) + '"></div>');
    $(div).append('<p><span>CONTACT</span><br>' + namesFormatted + '</p>');
    if (orgs[0]) {
      $(div).append('<p><span>ORGANIZATION</span><br>' + orgsFormatted + '</p>');
    }
    $(div).append('<p><span>MISSION</span><br>' + mission + '</p>');
    $(div).append('<p><span>PROJECT</span><br>' + project + '</p>');
    $(div).append('<p><span>RESEARCH</span><br>' + research + '</p>');
    $(div).append('<p><span>PRODUCTS</span><br>' + products + '</p>');
    if (learn) {
      $(div).append('<p><span>ADDITIONAL</span><br><a href="' + learn + '">Learn more</a></p>');
    }
    $(div).append('<p class="additional"></p>');
  }

  processStudentsAndFaculty('f');
}


// Reads students (who="s") & faculty (who="f") spreadsheets
function processStudentsAndFaculty(who) {

  Papa.parse(who === 's' ? studentsURL : facultyURL, {
    download: true,
    header: true,
    complete: function(result) {

      var data = result.data;
      var projects = {};

      for (var i in data) {
        var row = data[i];
        var name = row['Name'];
        if ($.trim(row['Weblink']) !== '') {
          var link = $.trim(row['Weblink']);
          if (link && link.indexOf('http') !== 0) {
            link = 'http://' + link;
          }
          name = '<a href="' + link + '">' + name + '</a>';
        }

        var keys = Object.keys(row);

        var choices = ['1st', '2nd', '3rd', '4th', '5th'];

        for (var j in keys) {
          var key = keys[j];

          choices.forEach(function(choice) {
            if (key.indexOf(choice) > -1) {
              var proj = row[key];
              if (!projects[proj]) {
                projects[proj] = {};
              }
              if (!projects[proj][choice]) {
                projects[proj][choice] = [];
              }

              projects[proj][choice].push(name);
            }
          });
        }
      }

      var projectKeys = Object.keys(projects);
      for (var p in projectKeys) {
        var proj = projectKeys[p];
        var message = '';

        if (who === 's') {
          var t = projects[proj];
          var n = Object.keys(t).map(function(x) {return t[x].length;}).reduce(function(a, b) {return a+b;});
          if (n > 0) {
            message = n + ' student' + (n === 1 ? ' is' : 's are') + ' interested in this project.';
          }
        } else {
          var fellows = [];
          for (var idx in choices) {
            if (projects[proj][choices[idx]]) {
              fellows = fellows.concat(projects[proj][choices[idx]]);
            }
          }

          var n = fellows.length;
          if (n > 0) {
            message = fellows.join(', ') + (n === 1 ? ' is a ' : ' are') + ' potential faculty fellow' + (n === 1 ? '' : 's') + '.<br>';
          }
        }

        $('#project-' + stripSpecialCharacters(proj) + ' .additional').append(message);
      }

      if (who === 'f') {
        processStudentsAndFaculty('s');
      }

    }
  });

}
