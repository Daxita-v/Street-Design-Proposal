# Export slides script

$ppSaveAsJPG = 17

$ppt = New-Object -ComObject PowerPoint.Application
$ppt.Visible = [Microsoft.Office.Core.MsoTriState]::msoTrue

$pptxPath = "d:\opencode\Street Design Ppt\CG_Road_Complete_Street_Study.pptx"
$presentation = $ppt.Presentations.Open($pptxPath, $false, $false, $false)

$exportDir = "d:\opencode\Street Design Ppt\exported_slides"
if (!(Test-Path $exportDir)) {
    New-Item -ItemType Directory -Path $exportDir | Out-Null
}

# Export each slide as image
$presentation.SaveAs($exportDir + "\slide", $ppSaveAsJPG)

# Extract text structure
$slidesData = @()

foreach ($slide in $presentation.Slides) {
    $slideIndex = $slide.SlideIndex
    $shapesData = @()
    
    foreach ($shape in $slide.Shapes) {
        $shapeName = $shape.Name
        $text = ""
        $hasText = $false
        
        # Check if shape has text
        if ($shape.HasTextFrame -and $shape.TextFrame.HasText) {
            $text = $shape.TextFrame.TextRange.Text
            $hasText = $true
        }
        
        $shapeInfo = [PSCustomObject]@{
            Id = $shape.Id
            Name = $shapeName
            Type = $shape.Type
            HasText = $hasText
            Text = $text
            Left = $shape.Left
            Top = $shape.Top
            Width = $shape.Width
            Height = $shape.Height
        }
        $shapesData += $shapeInfo
    }
    
    $slideInfo = [PSCustomObject]@{
        Index = $slideIndex
        SlideId = $slide.SlideID
        ImageName = "slide" + $slideIndex + ".jpg"
        Shapes = $shapesData
    }
    $slidesData += $slideInfo
}

$presentation.Close()
$ppt.Quit()

# Save JSON
$slidesData | ConvertTo-Json -Depth 5 | Out-File -FilePath "d:\opencode\Street Design Ppt\slides_data.json" -Encoding utf8
Write-Host "Slides exported successfully!"
