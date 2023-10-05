<!-- IMPORT partials/breadcrumbs.tpl -->
<div data-widget-area="header">
    {{{each widgets.header}}}
    {{widgets.header.html}}
    {{{end}}}
</div>
<div class="ungrouped">
    <div class="category">
        <!-- IF !topics.length -->
        <div class="alert alert-warning" id="category-no-topics">[[recent:no_popular_topics]]</div>
        <!-- ENDIF !topics.length -->

        <!-- IMPORT partials/ungrouped_topics_list.tpl -->

        <!-- IF config.usePagination -->
            <!-- IMPORT partials/paginator.tpl -->
        <!-- ENDIF config.usePagination -->
    </div>
</div>
