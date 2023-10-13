<div component="bugs/container" class="row" id="bugs-list">
    <!-- IF bugs.length -->
    <!-- IMPORT partials/bugs/list.tpl -->
    <!-- ELSE -->
    <div class="col-xs-12">
        <div class="alert alert-warning">
        [[bugs:no_bugs_found]]
        </div>
    </div>
    <!-- ENDIF bugs.length -->
</div>