/**
 * Copyright 2012 msg systems ag
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/
package org.openpythia.schemaprivileges;

import java.awt.Component;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import javax.swing.JOptionPane;

import org.openpythia.dbconnection.ConnectionPoolUtils;

public class PrivilegesHelper {

    // Yes, I know that these are dynamic views... But they behave like tables.
    private static final String[] USED_TABLES = {
            // buffer cache hit ratio
            "v$sysstat",
            // library cache hit ratio
            "v$librarycache",
            // snapshots, delta V$SQLARE
            "v$sqlarea", "v$sqltext_with_newlines", "v$sql_plan",
            // DB parameters
            "v_$parameter",
            // missing/stale statistics
            "dba_indexes", "dba_tables" };

    private static final String SELECT_USER_PRIVILEGES = "SELECT table_name "
            + "FROM user_tab_privs "
            + "WHERE grantor = 'SYS' AND privilege = 'SELECT'";

    public static List<String> getMissingObjectPrivileges(
            List<String> grantedObjects) {
        List<String> result = new ArrayList<String>();

        // check if there are objects missing
        for (String currentObject : USED_TABLES) {
            if (grantedObjects == null
                    || !grantedObjects.contains(currentObject.toLowerCase()
                            .replace("v$", "v_$"))) {
                result.add(currentObject);
            }
        }
        return result;
    }

    public static List<String> getMissingObjectPrivileges() {

        // get a list with all granted objects
        List<String> grantedObjects = new ArrayList<String>();
        Connection connection = ConnectionPoolUtils.getConnectionFromPool();
        try {
            PreparedStatement grantedObjectsStatement = connection
                    .prepareStatement(SELECT_USER_PRIVILEGES);

            ResultSet grantedObjectsResultSet = grantedObjectsStatement
                    .executeQuery();

            if (grantedObjectsResultSet != null) {
                while (grantedObjectsResultSet.next()) {
                    grantedObjects.add(grantedObjectsResultSet.getString(1).toLowerCase());
                }
            }

            grantedObjectsStatement.close();

        } catch (SQLException e) {
            JOptionPane.showMessageDialog((Component) null, e);
        } finally {
            try {
                connection.close();
            }
            catch (Exception e) {
                throw new RuntimeException(e);
            }
        }

        return getMissingObjectPrivileges(grantedObjects);
    }

    public static String createGrantScript(List<String> objectsToGrant,
            String grantee) {
        StringBuffer result = new StringBuffer();

        for (String currentObject : objectsToGrant) {
            result.append("GRANT select ON SYS."
                    + currentObject.replace("v$", "v_$") + " TO " + grantee
                    + ";\n");
        }

        return result.toString();
    }

}