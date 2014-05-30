var fs = require('fs')
var mkdirp =  require('mkdirp')
var handlebars = require('handlebars')
var marked = require('marked')

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false
})

module.exports = function htmlify(markdown, filename) {

  mkdirp('html', function (err) {
    if (err) return console.log(err)
  })

  var issues = fs.readFileSync('comments.json')
  issues = JSON.parse(issues)
  issues.forEach(function(issue) {
    issue = parseBody(issue)
    var filename = repoDetails(issue.url)
    var source = fs.readFileSync(__dirname + '/templates/html.hbs')
    var template = handlebars.compile(source.toString())
    var result = template(issue)
    fs.writeFile('html/' + filename + '.html', result, function (err) {
      if (err) return console.log(err)
    })
  })
  console.log('Wrote html files')

}

function repoDetails(issue) {
  var a = issue.split('/')
  var filename =  a[3] + '-' + a[4] + '-' + a[6]
  return filename
}

// since comments are in Markdown
// we should parse them into HTML
// before putting them in the template
function parseBody(issue) {
  issue.body = marked(issue.body)
  issue.comments = issue.comments.map(function(issue) {
    issue.body = marked(issue.body)
    return issue
  })
  return issue
}