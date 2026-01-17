
Add-Type -AssemblyName System.Drawing

function Optimize-Image {
    param (
        [string]$InputFile,
        [string]$OutputFile,
        [string]$Format = "JPEG",
        [int]$Quality = 75
    )

    Write-Host "Optimizing $InputFile to $OutputFile..."
    $FullPathInput = (Convert-Path $InputFile)
    $FullPathOutput = $OutputFile -as [string]
    if (-not (Test-Path $FullPathOutput)) {
        $null = New-Item -ItemType File -Path $FullPathOutput -Force
    }
    $FullPathOutput = (Convert-Path $FullPathOutput)

    try {
        $image = [System.Drawing.Image]::FromFile($FullPathInput)
        
        # Encoder parameter for quality
        $myEncoder = [System.Drawing.Imaging.Encoder]::Quality
        $encoderParameters = New-Object System.Drawing.Imaging.EncoderParameters(1)
        $encoderParameters.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter($myEncoder, $Quality)

        # Get codec info
        if ($Format -eq "JPEG") {
            $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
            $image.Save($OutputFile, $codec, $encoderParameters)
        }
        elseif ($Format -eq "PNG") {
            # PNG compression is harder to control with System.Drawing, mainly just re-saving
            $image.Save($OutputFile, [System.Drawing.Imaging.ImageFormat]::Png)
        }

        $image.Dispose()
        Write-Host "Success!"
    }
    catch {
        Write-Host "Error: $_"
    }
}

# Optimize Hero
Optimize-Image -InputFile "public/images/hero.png" -OutputFile "public/images/hero_opt.jpg" -Format "JPEG" -Quality 70
Optimize-Image -InputFile "public/images/video_thumb.jpg" -OutputFile "public/images/video_thumb_opt.jpg" -Format "JPEG" -Quality 70

# Optimize Pattern (Backgrounds usually fine as JPEG if no transparency needed, or just keep PNG)
# pattern.png likely has transparency, so better leave or re-save
# Optimize-Image -InputFile "public/images/pattern.png" -OutputFile "public/images/pattern_opt.png" -Format "PNG" 
