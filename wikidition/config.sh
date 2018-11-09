#!/bin/bash

set -e

# Executes maintainance for auto update
# TODO: Maybe we don't want this...
run_maintenance_script_if_needed () {
    if [ -f "$MW_VOLUME/$1.info" ]; then
        update_info="$(cat "$MW_VOLUME/$1.info" 2>/dev/null)"
    else
        update_info=""
    fi

    if [[ "$update_info" != "$2" && -n "$2" && "${2: -1}" != '-' ]]; then

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

    for i in {15..0}; do
        echo "Waiting for database to start ($i)..."
        sleep 1
    done

    php $MW_Home/maintenance/install.php \
        --confpath "$MW_VOLUME" \
        --dbserver "database" \
        --dbtype "mysql" \
        --dbname "$MW_DB_NAME" \
        --dbuser "$MW_DB_USER" \
        --dbpass "$MW_DB_PASS" \
        --installdbuser "$MW_DB_INSTALLDB_USER" \
        --installdbpass "$MW_DB_INSTALLDB_PASS" \
        --server "$MW_SITE_SERVER" \
        --scriptpath "/w" \
        --lang "$MW_SITE_LANG" \
        --pass "$MW_ADMIN_PASS" \
        "$MW_SITE_NAME" \
        "$MW_ADMIN_USER"

fi

# Rename DockerSettings.php to LocalSettings.php so that it will be found by Mediawiki
if [ ! -e "$MW_Home/LocalSettings.php" ]; then
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
