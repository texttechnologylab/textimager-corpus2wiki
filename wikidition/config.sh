#!/bin/bash

set -e

wait_database_started ()
{
    if [ -n "$db_started" ]; then
        return 0; # already started
    fi

    echo "Waiting for database to start"
    echo $1
    echo $2
    mysql=( mysql -h database -u $1 -p $2 )
    echo $mysql
    echo ${mysql[@]}

    for i in {300..0}; do
        if echo 'SELECT 1' | "${mysql[@]}" &> /dev/null; then
                break
        fi
        echo 'Waiting for database to start...'
        sleep 1
    done
    if [ "$i" = 0 ]; then
        echo >&2 'Could not connect to the database.'
        return 1
    fi
    echo 'Successfully connected to the database.'
    db_started="1"
    return 0
}

wait_elasticsearch_started ()
{
    return 0
}

run_maintenance_script_if_needed () {
    if [ -f "$MW_VOLUME/$1.info" ]; then
        update_info="$(cat "$MW_VOLUME/$1.info" 2>/dev/null)"
    else
        update_info=""
    fi

    if [[ "$update_info" != "$2" && -n "$2" && "${2: -1}" != '-' ]]; then
        wait_database_started "$MW_DB_INSTALLDB_USER" "$MW_DB_INSTALLDB_PASS"
        if [[ "$1" == *CirrusSearch* ]]; then wait_elasticsearch_started; fi 

        i=3
        while [ -n "${!i}" ]
        do
            if [ ! -f "`echo "${!i}" | awk '{print $1}'`" ]; then
                echo >&2 "Maintenance script does not exit: ${!i}"
                return 0;
            fi
            echo "Run maintenance script: ${!i}"
            runuser -c "php ${!i}" -s /bin/bash $WWW_USER
            i=$(( $i + 1 ))
        done

        echo "Successful updated: $2"
        echo "$2" > "$MW_VOLUME/$1.info"
    else
        echo "$1 is up to date: $2."
    fi
}

run_script_if_needed () {
    if [ -f "$MW_VOLUME/$1.info" ]; then
        update_info="$(cat "$MW_VOLUME/$1.info" 2>/dev/null)"
    else
        update_info=""
    fi

    if [[ "$update_info" != "$2" && -n "$2" && "${2: -1}" != '-' ]]; then
        wait_database_started "$MW_DB_INSTALLDB_USER" "$MW_DB_INSTALLDB_PASS"
        if [[ "$1" == *CirrusSearch* ]]; then wait_elasticsearch_started; fi 
        echo "Run script: $3"
        eval $3

        cd $MW_HOME

        echo "Successful updated: $2"
        echo "$2" > "$MW_VOLUME/$1.info"
    else
        echo "$1 is skipped: $2."
    fi
}

# 09/11/18 Commented this out because syntax error
# chown -R $WWW_USER:$WWW_GROUP $MW_VOLUME $MW_HOME

cd $MW_HOME

# If there is no LocalSettings.php, create one using maintenance/install.php
if [ ! -e "$MW_VOLUME/LocalSettings.php" ]; then
    echo "There is no LocalSettings.php, create one using maintenance/install.php"

    for x in MW_DB_INSTALLDB_USER MW_DB_INSTALLDB_PASS
    do
        if [ -z "${!x}" ]; then
            echo >&2 "Variable $x must be defined";
            exit 1;
        fi
    done

    echo $PWD;
    #wait_database_started $MW_DB_INSTALLDB_USER $MW_DB_INSTALLDB_PASS
    echo 'Waiting for database to start...'
    sleep 10

    php $MW_Home/maintenance/install.php \
        --confpath "$MW_VOLUME" \
        --dbserver "database" \
        --dbtype "mysql" \
        --dbname "wikidb" \
        --dbuser "root" \
        --dbpass "wikiexporterpw" \
        --installdbuser "$MW_DB_INSTALLDB_USER" \
        --installdbpass "$MW_DB_INSTALLDB_PASS" \
        --server "$MW_SITE_SERVER" \
        --scriptpath "/w" \
        --lang "$MW_SITE_LANG" \
        --pass "$MW_ADMIN_PASS" \
        "$MW_SITE_NAME" \
        "$MW_ADMIN_USER"

    # Append inclusion of DockerSettings.php
    #echo "@include('DockerSettings.php');" >> "$MW_Volume/LocalSettings.php"
fi

if [ ! -e "$MW_Home/LocalSettings.php" ]; then
    #ln -s "$MW_Volume/LocalSettings.php" "$MW_Home/LocalSettings.php"
    mv $MW_Home/DockerSettings.php $MW_Home/LocalSettings.php
fi

########## Run maintenance scripts ##########
if [ $MW_AUTOUPDATE == 'true' ]; then
    echo 'Check for the need to run maintenance scripts'
    ### maintenance/update.php
    run_maintenance_script_if_needed 'maintenance_update' "$MW_VERSION-$MW_MAINTENANCE_UPDATE" \
        'maintenance/update.php --quick'
fi

# Make sure we're not confused by old, incompletely-shutdown httpd
# context after restarting the container.  httpd won't start correctly
# if it thinks it is already running.

############### Run Apache ###############
rm -rf /run/apache2/*

exec apachectl -e info -D FOREGROUND
