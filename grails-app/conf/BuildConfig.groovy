/*
 * Copyright (c) 2010 iceScrum Technologies.
 *
 * This file is part of iceScrum.
 *
 * iceScrum is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License.
 *
 * iceScrum is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with iceScrum.  If not, see <http://www.gnu.org/licenses/>.
 *
 * Authors:
 *
 * Vincent Barrier (vbarrier@kagilum.com)
 * Stephane Maldini (stephane.maldini@icescrum.com)
 * Manuarii Stein (manuarii.stein@icescrum.com)
 */

import grails.util.GrailsNameUtils
import grails.util.Environment

//Workaround to detect grails environment
def environment = Environment.getCurrent()

grails.project.class.dir = "target/classes"
grails.project.test.class.dir = "target/test-classes"
grails.project.test.reports.dir = "target/test-reports"
grails.project.war.file = "target/${appName}.war"

grails.project.war.osgi.headers = false

if (environment != Environment.PRODUCTION){
    println "use inline plugin in env: ${environment}"
    grails.plugin.location.'icescrum-core' = '../plugins/icescrum-core'
    //grails.plugin.location.'icescrum-plugin-scm' =  '../plugins/icescrum-plugin-scm'
    //grails.plugin.location.'icescrum-plugin-management' =  '../plugins/icescrum-plugin-management'
}

if (environment == Environment.TEST){
    grails.plugin.location.'icescrum-test' =  '../plugins/icescrum-test'
}

coverage {
    enabledByDefault = false
    xml = true
}

grails.war.resources = { stagingDir ->
    copy(todir: "${stagingDir}/WEB-INF/classes/grails-app/i18n") {
        fileset(dir: "grails-app/i18n") {
            include(name: "report*")
        }
    }
}

grails.project.dependency.resolution = {
    // inherit Grails' default dependencies
    inherits("global"){
        excludes "xml-apis"
    }
    log "warn" // log level of Ivy resolver, either 'error', 'warn', 'info', 'debug' or 'verbose'
    repositories {
        grailsPlugins()
        grailsCentral()
        grailsHome()

        // uncomment the below to enable remote dependency resolution
        // from public Maven repositories
        //mavenLocal()
        mavenCentral()
        //mavenRepo "http://snapshots.repository.codehaus.org"
        mavenRepo "http://repository.codehaus.org"
        mavenRepo "http://repo.icescrum.org/artifactory/plugins-release/"
        mavenRepo "http://repo.icescrum.org/artifactory/plugins-snapshot/"
    }

    dependencies {
        // specify dependencies here under either 'build', 'compile', 'runtime', 'test' or 'provided' scopes eg.
        test 'xmlunit:xmlunit:1.3'
        runtime 'mysql:mysql-connector-java:5.1.18'
    }

    if (environment == Environment.PRODUCTION){
        plugins {
            compile "org.icescrum:icescrum-core:1.5-SNAPSHOT"
            compile ":tomcat:1.3.7"
        }
    }else{
        plugins {
            compile ":tomcatnio:1.3.4"
        }
    }

    plugins {
        compile "org.icescrum:entry-points:0.3.2"
        compile ":cache-headers:1.1.5"
        compile ":cached-resources:1.0"
        compile ":feeds:1.5"
        compile ":hibernate:1.3.7"
        compile ":jquery:1.7.1"
        compile ":jquery-ui:1.8.11"
        compile ":resources:1.1.6"
        compile ":session-temp-files:1.0"
        compile ":zipped-resources:1.0"
        compile ":yui-minify-resources:0.1.5"
    }
}

//iceScrum plugins management
def iceScrumPluginsDir = System.getProperty("icescrum.plugins.dir") ?: false
println "Compile and use icescrum plugins : ${iceScrumPluginsDir ? true : false}"

if (iceScrumPluginsDir) {
    "${iceScrumPluginsDir}".split(";").each {
        File dir = new File(it.toString())
        println "Scanning plugin dir : ${dir.canonicalPath}"

        if (dir.exists()) {
            File descriptor = dir.listFiles(new FilenameFilter() {
                public boolean accept(File file, String s) {
                    return s.endsWith("GrailsPlugin.groovy");
                }
            })[0] ?: null;

            if (descriptor) {
                String name = GrailsNameUtils.getPluginName(descriptor.getName());
                println "found plugin : ${name}"
                grails.plugin.location."${name}" = "${it}"
            }
        } else {
            println "no plugin found in dir"
        }

    }
}