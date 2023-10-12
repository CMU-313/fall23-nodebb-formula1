<!-- IMPORT partials/breadcrumbs.tpl -->
<div data-widget-area="header">
    {{{each widgets.header}}}
    {{widgets.header.html}}
    {{{end}}}
</div>
<div class="authorize user">
    <!-- IF loggedIn -->
    <!-- IF !isAdminOrMod -->
        <!-- IMPORT themes/nodebb-theme-persona/templates/bug-form.tpl-->
    <!-- ELSE -->
        <table border="1">
            <thead>
                <tr>
                    <th>Bug ID</th>
                    <th>Name</th>
                    <th>Description</th>
                </tr>
            </thead>
            <!-- <tbody> -->
                <!--{{{each bugs}}}-->
                <!--<tr>-->
                    <!--<td>{bugs.bid}</td>-->
                    <!--<td>{bugs.name}</td>-->
                    <!--<td>{bugs.description}</td>-->
                <!--</tr>-->
                <!--{{{/each}}}-->
            <!--</tbody>-->
        </table>
    <!-- ENDIF isAdminOrMod -->
    <!-- ENDIF loggedIn -->
</div>
<div data-widget-area="footer">
    {{{each widgets.footer}}}
    {{widgets.footer.html}}
    {{{end}}}
</div>
