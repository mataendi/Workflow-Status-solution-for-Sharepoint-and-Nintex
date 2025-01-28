
Add-Type -Path "location\Microsoft.SharePoint.dll"


$csvPath = ".\sitesExported.csv"
$testModeCount = 3 

function AddCustomActionAndUploadFile($web, $listTitle, $actualURL) {
    try {

        $list = $web.Lists[$listTitle]
        Write-Host "List Title:" -ForegroundColor Green $list.Title

 
        $localFilePath = "location\WorkflowStatus.aspx"
        $fileContent = [System.IO.File]::ReadAllBytes($localFilePath)
        $fileUrl = $list.RootFolder.ServerRelativeUrl + "/" + [System.IO.Path]::GetFileName($localFilePath)
        $list.RootFolder.Files.Add($fileUrl, $fileContent, $true)

       
        AddOrUpdateCustomActionToList $web $listTitle $fileUrl $actualURL
        Write-Host "Custom action added to list $listTitle."
    } catch {
        Write-Host "Error adding custom action to list ${listTitle}: $_.Exception.Message" -ForegroundColor Red
    }
}


function AddOrUpdateCustomActionToList($web, $listTitle, $fileUrl, $actualURL) {
    try {
        $list = $web.Lists[$listTitle]


        $existingAction = $list.UserCustomActions | Where-Object { $_.Title -eq "Workflow Status" }
        if ($existingAction -ne $null) {
 
            $customAction = $existingAction
        } else {

            $customAction = $list.UserCustomActions.Add()
        }


        $listRelativeUrl = $list.RootFolder.Name
        Write-Host "relativeListURL: $listRelativeUrl"


        $customAction.Title = "Workflow Status"
        $customAction.Location = "CommandUI.Ribbon.DisplayForm"
        $customAction.Sequence = 0
        $customAction.Url = $fileUrl
        $customAction.CommandUIExtension = @"
            <CommandUIExtension xmlns="http://schemas.microsoft.com/sharepoint/">
            <CommandUIDefinitions>
            <CommandUIDefinition Location="Ribbon.ListForm.Display.Actions.Controls._children">
            <Button
                           Id="CustomActionButton"
                           Alt="Workflow Status"
                           Sequence="0"
                           Command="CustomActionButtonCommand"
                           Image32by32="sharepointSite.com/Icons/wfIcon32x32.png"
                           Image16by16="sharepointSite.com/Icons/wfIcon16x16.png"
                           LabelText="Workflow Status"
                           TemplateAlias="o1"
                           />
            </CommandUIDefinition>
            </CommandUIDefinitions>
            <CommandUIHandlers>
            <CommandUIHandler
                       Command="CustomActionButtonCommand"
                       CommandAction="javascript:
                            function navigateToWorkflowStatus() {
                                 window.location.href = '$actualURL/Lists/$listRelativeUrl/WorkflowStatus.aspx?&amp;List={$($list.Id)}&amp;ID={ItemId}&amp;Source={Source}';
                            }
                            navigateToWorkflowStatus();
                            " />
            </CommandUIHandlers>
            </CommandUIExtension>
"@

        $customAction.Update()
        Write-Host "Custom action added or updated in the list $listTitle."
    } catch {
        Write-Host "Error adding or updating custom action in list ${listTitle}: $_.Exception.Message" -ForegroundColor Red
    }
}

function ProcessCsvData($csvData) {
    foreach ($row in $csvData) {
        $webUrl = $row.WebUrl
        $listName = $row.ListName

        try {
            $site = New-Object Microsoft.SharePoint.SPSite($webUrl)
            $web = $site.OpenWeb()

            if ($web.Lists[$listName]) {
                Write-Host "Adding Custom Action to list: $listName in web: $webUrl"
                AddCustomActionAndUploadFile $web $listName $webUrl
            } else {
                Write-Host "List $listName not found in web: $webUrl" -ForegroundColor Yellow
            }

            $web.Dispose()
            $site.Dispose()
        } catch {
            Write-Host "Error processing web ${webUrl}: $_.Exception.Message" -ForegroundColor Red
        }
    }
}


$csvData = Import-Csv -Path $csvPath
if ($testModeCount) {
    $csvData = $csvData | Select-Object -First $testModeCount
}


ProcessCsvData $csvData

# Skriptende
Write-Host "WorkflowStatus deployed on all sites"