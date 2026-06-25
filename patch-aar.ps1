Add-Type -AssemblyName System.IO.Compression.FileSystem

function Patch-AAR ($zipPath) {
    Write-Host "Patching $zipPath"
    $zip = [System.IO.Compression.ZipFile]::Open($zipPath, 'Update')
    $entry = $zip.GetEntry('prefab/modules/reactnative/include/react/renderer/core/graphicsConversions.h')
    if ($entry -ne $null) {
        $stream = $entry.Open()
        $reader = New-Object System.IO.StreamReader($stream)
        $content = $reader.ReadToEnd()
        $stream.Position = 0
        $stream.SetLength(0)
        $content = $content.Replace('std::format("{}%", dimension.value)', 'std::to_string(dimension.value) + "%"')
        $writer = New-Object System.IO.StreamWriter($stream)
        $writer.Write($content)
        $writer.Flush()
        $stream.Close()
        Write-Host "Patched $zipPath successfully"
    } else {
        Write-Host "Entry not found in $zipPath"
    }
    $zip.Dispose()
}

$releaseAar = "D:\gradle_cache\caches\modules-2\files-2.1\com.facebook.react\react-android\0.83.6\7205749304aae9fddc0af9864cf490bafd3a4c5f\react-android-0.83.6-release.aar"
$debugAar = "D:\gradle_cache\caches\modules-2\files-2.1\com.facebook.react\react-android\0.83.6\743d7e58ca2fbd3a2b3f86207b0800169f866974\react-android-0.83.6-debug.aar"

Patch-AAR $releaseAar
Patch-AAR $debugAar

Write-Host "Cleaning extracted transforms..."
Remove-Item -Recurse -Force "D:\gradle_cache\caches\9.0.0\transforms\*" -ErrorAction SilentlyContinue
Write-Host "Transforms cleaned."
